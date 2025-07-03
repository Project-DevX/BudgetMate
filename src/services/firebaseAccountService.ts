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
import { Account, ApiResponse } from "../types";
import { firebaseAuthService } from "./firebaseAuthService";

export class FirebaseAccountService {
  private getCollectionRef() {
    return collection(db, "accounts");
  }

  private getUserId(): string {
    const user = firebaseAuthService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    return user.uid;
  }

  // Create a new account
  async createAccount(
    data: Omit<Account, "id" | "userId">
  ): Promise<ApiResponse<Account>> {
    try {
      const userId = this.getUserId();
      const accountRef = doc(this.getCollectionRef());

      const account: Account = {
        ...data,
        id: accountRef.id,
        userId,
      };

      await setDoc(accountRef, {
        ...account,
        lastSynced: Timestamp.fromDate(new Date(account.lastSynced)),
      });

      console.log("Account created successfully:", account.id);
      return {
        success: true,
        data: account,
      };
    } catch (error: any) {
      console.error("Error creating account:", error);
      return {
        success: false,
        error: error.message || "Failed to create account",
      };
    }
  }

  // Get all user accounts
  async getAccounts(): Promise<ApiResponse<Account[]>> {
    try {
      const userId = this.getUserId();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("isActive", "==", true),
        orderBy("name", "asc")
      );

      const querySnapshot = await getDocs(q);
      const accounts = querySnapshot.docs.map((doc) =>
        this.convertFirestoreAccount(doc)
      );

      return {
        success: true,
        data: accounts,
      };
    } catch (error: any) {
      console.error("Error getting accounts:", error);
      return {
        success: false,
        error: error.message || "Failed to get accounts",
      };
    }
  }

  // Get a single account
  async getAccount(id: string): Promise<ApiResponse<Account>> {
    try {
      const userId = this.getUserId();
      const accountRef = doc(this.getCollectionRef(), id);
      const accountSnap = await getDoc(accountRef);

      if (!accountSnap.exists()) {
        return {
          success: false,
          error: "Account not found",
        };
      }

      const data = accountSnap.data();

      // Check if user owns this account
      if (data.userId !== userId) {
        return {
          success: false,
          error: "Unauthorized access to account",
        };
      }

      const account = this.convertFirestoreAccount(accountSnap);
      return {
        success: true,
        data: account,
      };
    } catch (error: any) {
      console.error("Error getting account:", error);
      return {
        success: false,
        error: error.message || "Failed to get account",
      };
    }
  }

  // Update an account
  async updateAccount(
    id: string,
    updates: Partial<Account>
  ): Promise<ApiResponse<Account>> {
    try {
      // First check if account exists and user owns it
      const existingAccount = await this.getAccount(id);
      if (!existingAccount.success) {
        return existingAccount;
      }

      const accountRef = doc(this.getCollectionRef(), id);
      const updateData: any = { ...updates };

      // Convert lastSynced if provided
      if (updates.lastSynced) {
        updateData.lastSynced = Timestamp.fromDate(
          new Date(updates.lastSynced)
        );
      }

      await updateDoc(accountRef, updateData);

      // Get the updated account
      const updatedAccount = await this.getAccount(id);
      return updatedAccount;
    } catch (error: any) {
      console.error("Error updating account:", error);
      return {
        success: false,
        error: error.message || "Failed to update account",
      };
    }
  }

  // Delete an account (soft delete - mark as inactive)
  async deleteAccount(id: string): Promise<ApiResponse<void>> {
    try {
      // First check if account exists and user owns it
      const existingAccount = await this.getAccount(id);
      if (!existingAccount.success) {
        return {
          success: false,
          error: existingAccount.error,
        };
      }

      const accountRef = doc(this.getCollectionRef(), id);
      await updateDoc(accountRef, { isActive: false });

      console.log("Account deactivated successfully:", id);
      return {
        success: true,
      };
    } catch (error: any) {
      console.error("Error deleting account:", error);
      return {
        success: false,
        error: error.message || "Failed to delete account",
      };
    }
  }

  // Update account balance
  async updateAccountBalance(
    id: string,
    newBalance: number
  ): Promise<ApiResponse<Account>> {
    try {
      return this.updateAccount(id, {
        balance: newBalance,
        lastSynced: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error("Error updating account balance:", error);
      return {
        success: false,
        error: error.message || "Failed to update account balance",
      };
    }
  }

  // Real-time listener for accounts
  subscribeToAccounts(callback: (accounts: Account[]) => void): () => void {
    try {
      const userId = this.getUserId();
      const q = query(
        this.getCollectionRef(),
        where("userId", "==", userId),
        where("isActive", "==", true),
        orderBy("name", "asc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const accounts = querySnapshot.docs.map((doc) =>
          this.convertFirestoreAccount(doc)
        );
        callback(accounts);
      });

      return unsubscribe;
    } catch (error: any) {
      console.error("Error setting up account subscription:", error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Helper method to convert Firestore document to Account type
  private convertFirestoreAccount(doc: DocumentSnapshot): Account {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      lastSynced: data.lastSynced.toDate().toISOString(),
    } as Account;
  }
}

// Export singleton instance
export const firebaseAccountService = new FirebaseAccountService();
