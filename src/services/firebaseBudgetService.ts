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
  Timestamp,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Budget, ApiResponse } from "../types";
import { firebaseAuthService } from "./firebaseAuthService";

export class FirebaseBudgetService {
  private getCollectionRef() {
    return collection(db, "budgets");
  }

  private getUserId(): string {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.uid;
  }

  // Create a new budget
  async createBudget(
    data: Omit<Budget, "id" | "userId" | "spent" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Budget>> {
    try {
      const userId = this.getUserId();
      const budgetRef = doc(this.getCollectionRef());

      const budget: Budget = {
        ...data,
        id: budgetRef.id,
        userId,
        spent: 0, // Initialize spent amount to 0
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(budgetRef, {
        ...budget,
        startDate: Timestamp.fromDate(new Date(budget.startDate)),
        endDate: Timestamp.fromDate(new Date(budget.endDate)),
        createdAt: Timestamp.fromDate(new Date(budget.createdAt)),
        updatedAt: Timestamp.fromDate(new Date(budget.updatedAt)),
      });

      console.log("Budget created successfully:", budget.id);
      return {
        success: true,
        data: budget,
      };
    } catch (error: any) {
      console.error("Error creating budget:", error);
      return {
        success: false,
        error: error.message || "Failed to create budget",
      };
    }
  }

  // Get all user budgets
  async getBudgets(activeOnly: boolean = true): Promise<ApiResponse<Budget[]>> {
    try {
      const userId = this.getUserId();
      let q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      if (activeOnly) {
        q = query(q, where("isActive", "==", true));
      }

      const querySnapshot = await getDocs(q);
      const budgets = querySnapshot.docs.map((doc) =>
        this.convertFirestoreBudget(doc)
      );

      return {
        success: true,
        data: budgets,
      };
    } catch (error: any) {
      console.error("Error getting budgets:", error);
      return {
        success: false,
        error: error.message || "Failed to get budgets",
      };
    }
  }

  // Get budgets for current period
  async getCurrentBudgets(): Promise<ApiResponse<Budget[]>> {
    try {
      const userId = this.getUserId();
      const now = new Date();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("isActive", "==", true),
        where("startDate", "<=", Timestamp.fromDate(now)),
        where("endDate", ">=", Timestamp.fromDate(now)),
        orderBy("startDate", "desc")
      );

      const querySnapshot = await getDocs(q);
      const budgets = querySnapshot.docs.map((doc) =>
        this.convertFirestoreBudget(doc)
      );

      return {
        success: true,
        data: budgets,
      };
    } catch (error: any) {
      console.error("Error getting current budgets:", error);
      return {
        success: false,
        error: error.message || "Failed to get current budgets",
      };
    }
  }

  // Get a single budget
  async getBudget(id: string): Promise<ApiResponse<Budget>> {
    try {
      const userId = this.getUserId();
      const budgetRef = doc(this.getCollectionRef(), id);
      const budgetSnap = await getDoc(budgetRef);

      if (!budgetSnap.exists()) {
        return {
          success: false,
          error: "Budget not found",
        };
      }

      const data = budgetSnap.data();

      // Check if user owns this budget
      if (data.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized access to budget",
        };
      }

      const budget = this.convertFirestoreBudget(budgetSnap);
      return {
        success: true,
        data: budget,
      };
    } catch (error: any) {
      console.error("Error getting budget:", error);
      return {
        success: false,
        error: error.message || "Failed to get budget",
      };
    }
  }

  // Update a budget
  async updateBudget(
    id: string,
    updates: Partial<Budget>
  ): Promise<ApiResponse<Budget>> {
    try {
      // First check if budget exists and user owns it
      const existingBudget = await this.getBudget(id);
      if (!existingBudget.success) {
        return existingBudget;
      }

      const budgetRef = doc(this.getCollectionRef(), id);
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date()),
      };

      // Convert dates if provided
      if (updates.startDate) {
        updateData.startDate = Timestamp.fromDate(new Date(updates.startDate));
      }
      if (updates.endDate) {
        updateData.endDate = Timestamp.fromDate(new Date(updates.endDate));
      }

      await updateDoc(budgetRef, updateData);

      // Get the updated budget
      const updatedBudget = await this.getBudget(id);
      return updatedBudget;
    } catch (error: any) {
      console.error("Error updating budget:", error);
      return {
        success: false,
        error: error.message || "Failed to update budget",
      };
    }
  }

  // Update budget spent amount
  async updateBudgetSpent(
    id: string,
    spentAmount: number
  ): Promise<ApiResponse<Budget>> {
    try {
      return this.updateBudget(id, {
        spent: spentAmount,
      });
    } catch (error: any) {
      console.error("Error updating budget spent amount:", error);
      return {
        success: false,
        error: error.message || "Failed to update budget spent amount",
      };
    }
  }

  // Delete a budget (soft delete - mark as inactive)
  async deleteBudget(id: string): Promise<ApiResponse<void>> {
    try {
      // First check if budget exists and user owns it
      const existingBudget = await this.getBudget(id);
      if (!existingBudget.success) {
        return {
          success: false,
          error: existingBudget.error,
        };
      }

      const budgetRef = doc(this.getCollectionRef(), id);
      await updateDoc(budgetRef, {
        isActive: false,
        updatedAt: Timestamp.fromDate(new Date()),
      });

      console.log("Budget deactivated successfully:", id);
      return {
        success: true,
      };
    } catch (error: any) {
      console.error("Error deleting budget:", error);
      return {
        success: false,
        error: error.message || "Failed to delete budget",
      };
    }
  }

  // Get budget by category
  async getBudgetByCategory(
    category: string
  ): Promise<ApiResponse<Budget | null>> {
    try {
      const userId = this.getUserId();
      const now = new Date();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("category", "==", category),
        where("isActive", "==", true),
        where("startDate", "<=", Timestamp.fromDate(now)),
        where("endDate", ">=", Timestamp.fromDate(now))
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: true,
          data: null,
        };
      }

      // Get the first matching budget
      const budget = this.convertFirestoreBudget(querySnapshot.docs[0]);
      return {
        success: true,
        data: budget,
      };
    } catch (error: any) {
      console.error("Error getting budget by category:", error);
      return {
        success: false,
        error: error.message || "Failed to get budget by category",
      };
    }
  }

  // Real-time listener for budgets
  subscribeToCurrentBudgets(callback: (budgets: Budget[]) => void): () => void {
    try {
      const userId = this.getUserId();
      const now = new Date();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("isActive", "==", true),
        where("startDate", "<=", Timestamp.fromDate(now)),
        where("endDate", ">=", Timestamp.fromDate(now)),
        orderBy("startDate", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const budgets = querySnapshot.docs.map((doc) =>
          this.convertFirestoreBudget(doc)
        );
        callback(budgets);
      });

      return unsubscribe;
    } catch (error: any) {
      console.error("Error setting up budget subscription:", error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Helper method to convert Firestore document to Budget type
  private convertFirestoreBudget(doc: DocumentSnapshot): Budget {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      startDate: data.startDate.toDate().toISOString(),
      endDate: data.endDate.toDate().toISOString(),
      createdAt: data.createdAt.toDate().toISOString(),
      updatedAt: data.updatedAt.toDate().toISOString(),
    } as Budget;
  }
}

// Export singleton instance
export const firebaseBudgetService = new FirebaseBudgetService();
