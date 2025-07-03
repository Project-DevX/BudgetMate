import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import {
  Transaction,
  ApiResponse,
  PaginatedResponse,
  TransactionFilters,
} from "../types";
import { firebaseAuthService } from "./firebaseAuthService";

export class FirebaseTransactionService {
  private getCollectionRef() {
    return collection(db, "transactions");
  }

  private getUserId(): string {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.uid;
  }

  // Create a new transaction
  async createTransaction(
    data: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Transaction>> {
    try {
      const userId = this.getUserId();
      const transactionRef = doc(this.getCollectionRef());

      const transaction: Transaction = {
        ...data,
        id: transactionRef.id,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Filter out undefined values to avoid Firestore errors
      const firestoreData = Object.fromEntries(
        Object.entries({
          ...transaction,
          date: Timestamp.fromDate(new Date(transaction.date)),
          createdAt: Timestamp.fromDate(new Date(transaction.createdAt)),
          updatedAt: Timestamp.fromDate(new Date(transaction.updatedAt)),
        }).filter(([_, value]) => value !== undefined)
      );

      await setDoc(transactionRef, firestoreData);

      console.log("Transaction created successfully:", transaction.id);
      return {
        success: true,
        data: transaction,
      };
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to create transaction",
      };
    }
  }

  // Get a single transaction by ID
  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    try {
      const userId = this.getUserId();
      const transactionRef = doc(this.getCollectionRef(), id);
      const transactionSnap = await getDoc(transactionRef);

      if (!transactionSnap.exists()) {
        return {
          success: false,
          error: "Transaction not found",
        };
      }

      const data = transactionSnap.data();

      // Check if user owns this transaction
      if (data.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized access to transaction",
        };
      }

      const transaction = this.convertFirestoreTransaction(transactionSnap);
      return {
        success: true,
        data: transaction,
      };
    } catch (error: any) {
      console.error("Error getting transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to get transaction",
      };
    }
  }

  // Get transactions with filtering and pagination
  async getTransactions(
    filters: Partial<TransactionFilters> = {},
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    try {
      const userId = this.getUserId();

      // Start with basic query - userId filter and date ordering
      // This should work without requiring additional indexes
      let q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        orderBy("date", "desc"),
        limit(pageSize * page) // Get enough for pagination
      );

      console.log("🔥 Fetching transactions for user:", userId);
      const querySnapshot = await getDocs(q);
      console.log("🔥 Found", querySnapshot.docs.length, "transactions");

      let transactions = querySnapshot.docs.map((doc) =>
        this.convertFirestoreTransaction(doc)
      );

      // Apply client-side filtering for now to avoid index requirements
      let filteredTransactions = transactions;

      // Filter by accounts
      if (filters.accounts && filters.accounts.length > 0) {
        filteredTransactions = filteredTransactions.filter((transaction) =>
          filters.accounts!.includes(transaction.accountId)
        );
      }

      // Filter by categories
      if (filters.categories && filters.categories.length > 0) {
        filteredTransactions = filteredTransactions.filter((transaction) =>
          filters.categories!.includes(transaction.category)
        );
      }

      // Filter by date range
      if (filters.dateRange?.startDate) {
        const startDate = new Date(filters.dateRange.startDate);
        filteredTransactions = filteredTransactions.filter(
          (transaction) => new Date(transaction.date) >= startDate
        );
      }
      if (filters.dateRange?.endDate) {
        const endDate = new Date(filters.dateRange.endDate);
        filteredTransactions = filteredTransactions.filter(
          (transaction) => new Date(transaction.date) <= endDate
        );
      }

      // Filter by search if provided
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase();
        filteredTransactions = filteredTransactions.filter(
          (transaction) =>
            transaction.description.toLowerCase().includes(searchTerm) ||
            transaction.merchant?.toLowerCase().includes(searchTerm) ||
            transaction.category.toLowerCase().includes(searchTerm)
        );
      }

      // Filter by amount range if provided
      if (filters.amountRange) {
        filteredTransactions = filteredTransactions.filter((transaction) => {
          const amount = Math.abs(transaction.amount);
          return (
            amount >= (filters.amountRange!.min || 0) &&
            amount <= (filters.amountRange!.max || Infinity)
          );
        });
      }

      const totalCount = filteredTransactions.length;
      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;

      return {
        success: true,
        data: {
          data: filteredTransactions,
          total: totalCount,
          page,
          limit: pageSize,
          totalPages,
        },
      };
    } catch (error: any) {
      console.error("Error getting transactions:", error);
      return {
        success: false,
        error: error.message || "Failed to get transactions",
      };
    }
  }

  // Simple method to get all transactions for a user (no complex filtering)
  async getAllTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      const userId = this.getUserId();

      // Simple query - just user filter and date ordering
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        orderBy("date", "desc")
      );

      console.log("🔥 Fetching all transactions for user:", userId);
      const querySnapshot = await getDocs(q);
      console.log("🔥 Found", querySnapshot.docs.length, "transactions");

      const transactions = querySnapshot.docs.map((doc) =>
        this.convertFirestoreTransaction(doc)
      );

      return {
        success: true,
        data: transactions,
      };
    } catch (error: any) {
      console.error("Error getting all transactions:", error);
      return {
        success: false,
        error: error.message || "Failed to get transactions",
      };
    }
  }

  // Update a transaction
  async updateTransaction(
    id: string,
    updates: Partial<Transaction>
  ): Promise<ApiResponse<Transaction>> {
    try {
      const userId = this.getUserId();
      const transactionRef = doc(this.getCollectionRef(), id);

      // First check if transaction exists and user owns it
      const existingTransaction = await this.getTransaction(id);
      if (!existingTransaction.success) {
        return existingTransaction;
      }

      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Convert date if provided
      if (updates.date) {
        updateData.date = Timestamp.fromDate(new Date(updates.date));
      }

      await updateDoc(transactionRef, updateData);

      // Get the updated transaction
      const updatedTransaction = await this.getTransaction(id);
      return updatedTransaction;
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to update transaction",
      };
    }
  }

  // Delete a transaction
  async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    try {
      const userId = this.getUserId();

      // First check if transaction exists and user owns it
      const existingTransaction = await this.getTransaction(id);
      if (!existingTransaction.success) {
        return {
          success: false,
          error: existingTransaction.error,
        };
      }

      const transactionRef = doc(this.getCollectionRef(), id);
      await deleteDoc(transactionRef);

      console.log("Transaction deleted successfully:", id);
      return {
        success: true,
      };
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      return {
        success: false,
        error: error.message || "Failed to delete transaction",
      };
    }
  }

  // Bulk create transactions (useful for importing)
  async bulkCreateTransactions(
    transactions: Omit<
      Transaction,
      "id" | "userId" | "createdAt" | "updatedAt"
    >[]
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const userId = this.getUserId();
      const batch = writeBatch(db);
      const createdTransactions: Transaction[] = [];

      transactions.forEach((transactionData) => {
        const transactionRef = doc(this.getCollectionRef());
        const transaction: Transaction = {
          ...transactionData,
          id: transactionRef.id,
          userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        batch.set(transactionRef, {
          ...transaction,
          date: Timestamp.fromDate(new Date(transaction.date)),
          createdAt: Timestamp.fromDate(new Date(transaction.createdAt)),
          updatedAt: Timestamp.fromDate(new Date(transaction.updatedAt)),
        });

        createdTransactions.push(transaction);
      });

      await batch.commit();

      console.log(`Bulk created ${createdTransactions.length} transactions`);
      return {
        success: true,
        data: createdTransactions,
      };
    } catch (error: any) {
      console.error("Error bulk creating transactions:", error);
      return {
        success: false,
        error: error.message || "Failed to bulk create transactions",
      };
    }
  }

  // Get transactions for a specific date range (useful for analytics)
  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ApiResponse<Transaction[]>> {
    try {
      const userId = this.getUserId();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("date", ">=", Timestamp.fromDate(startDate)),
        where("date", "<=", Timestamp.fromDate(endDate)),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) =>
        this.convertFirestoreTransaction(doc)
      );

      return {
        success: true,
        data: transactions,
      };
    } catch (error: any) {
      console.error("Error getting transactions by date range:", error);
      return {
        success: false,
        error: error.message || "Failed to get transactions by date range",
      };
    }
  }

  // Real-time listener for transactions
  subscribeToTransactions(
    callback: (transactions: Transaction[]) => void,
    filters: Partial<TransactionFilters> = {}
  ): () => void {
    try {
      const userId = this.getUserId();
      let q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        orderBy("date", "desc"),
        limit(50) // Limit for real-time updates
      );

      // Apply filters
      if (filters.accounts && filters.accounts.length > 0) {
        q = query(q, where("accountId", "in", filters.accounts));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const transactions = querySnapshot.docs.map((doc) =>
          this.convertFirestoreTransaction(doc)
        );
        callback(transactions);
      });

      return unsubscribe;
    } catch (error: any) {
      console.error("Error setting up transaction subscription:", error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Helper method to convert Firestore document to Transaction type
  private convertFirestoreTransaction(doc: DocumentSnapshot): Transaction {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      date: data.date.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as Transaction;
  }
}

// Export singleton instance
export const firebaseTransactionService = new FirebaseTransactionService();
