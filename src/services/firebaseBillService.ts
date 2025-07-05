import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Bill, ApiResponse } from "../types";

const COLLECTION_NAME = "bills";

export const billService = {
  // Get all bills for the current user
  async getBills(): Promise<ApiResponse<Bill[]>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const billsQuery = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", user.uid),
        orderBy("dueDate", "asc")
      );

      const querySnapshot = await getDocs(billsQuery);
      const bills: Bill[] = [];

      querySnapshot.forEach((doc) => {
        bills.push({ id: doc.id, ...doc.data() } as Bill);
      });

      return { success: true, data: bills };
    } catch (error) {
      console.error("Error getting bills:", error);
      return { success: false, error: "Failed to fetch bills" };
    }
  },

  // Add a new bill
  async addBill(
    billData: Omit<Bill, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Bill>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const newBill = {
        ...billData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reminders: billData.reminders || [],
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newBill);
      const createdBill = { id: docRef.id, ...newBill } as Bill;

      return { success: true, data: createdBill };
    } catch (error) {
      console.error("Error adding bill:", error);
      return { success: false, error: "Failed to add bill" };
    }
  },

  // Update an existing bill
  async updateBill(
    billId: string,
    updates: Partial<Bill>
  ): Promise<ApiResponse<Bill>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const billRef = doc(db, COLLECTION_NAME, billId);
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(billRef, updateData);

      return { success: true, message: "Bill updated successfully" };
    } catch (error) {
      console.error("Error updating bill:", error);
      return { success: false, error: "Failed to update bill" };
    }
  },

  // Delete a bill
  async deleteBill(billId: string): Promise<ApiResponse<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const billRef = doc(db, COLLECTION_NAME, billId);
      await deleteDoc(billRef);

      return { success: true, message: "Bill deleted successfully" };
    } catch (error) {
      console.error("Error deleting bill:", error);
      return { success: false, error: "Failed to delete bill" };
    }
  },

  // Mark bill as paid
  async markBillPaid(billId: string): Promise<ApiResponse<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const billRef = doc(db, COLLECTION_NAME, billId);
      await updateDoc(billRef, {
        isPaid: true,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: "Bill marked as paid" };
    } catch (error) {
      console.error("Error marking bill as paid:", error);
      return { success: false, error: "Failed to mark bill as paid" };
    }
  },

  // Get upcoming bills (next 30 days)
  async getUpcomingBills(): Promise<ApiResponse<Bill[]>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      const billsQuery = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", user.uid),
        where("dueDate", ">=", today.toISOString()),
        where("dueDate", "<=", thirtyDaysFromNow.toISOString()),
        where("isPaid", "==", false),
        orderBy("dueDate", "asc")
      );

      const querySnapshot = await getDocs(billsQuery);
      const bills: Bill[] = [];

      querySnapshot.forEach((doc) => {
        bills.push({ id: doc.id, ...doc.data() } as Bill);
      });

      return { success: true, data: bills };
    } catch (error) {
      console.error("Error getting upcoming bills:", error);
      return { success: false, error: "Failed to fetch upcoming bills" };
    }
  },
};
