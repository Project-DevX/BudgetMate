import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import {
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { ApiResponse } from "../types";

export interface UserSettings {
  notifications: {
    billReminders: boolean;
    budgetAlerts: boolean;
    transactionSync: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  privacy: {
    biometricAuth: boolean;
    requirePasswordForTransactions: boolean;
    shareDataForInsights: boolean;
    autoSync: boolean;
  };
  preferences: {
    currency: string;
    dateFormat: string;
    theme: "light" | "dark" | "system";
  };
  updatedAt: string;
}

export const defaultSettings: UserSettings = {
  notifications: {
    billReminders: true,
    budgetAlerts: true,
    transactionSync: false,
    weeklyReports: true,
    monthlyReports: true,
  },
  privacy: {
    biometricAuth: false,
    requirePasswordForTransactions: true,
    shareDataForInsights: false,
    autoSync: true,
  },
  preferences: {
    currency: "LKR",
    dateFormat: "DD/MM/YYYY",
    theme: "dark",
  },
  updatedAt: new Date().toISOString(),
};

export class SettingsService {
  async getUserSettings(userId: string): Promise<ApiResponse<UserSettings>> {
    try {
      const settingsRef = doc(db, "userSettings", userId);
      const settingsDoc = await getDoc(settingsRef);

      if (settingsDoc.exists()) {
        const settings = settingsDoc.data() as UserSettings;
        return {
          success: true,
          data: settings,
        };
      } else {
        // Create default settings for user
        await setDoc(settingsRef, defaultSettings);
        return {
          success: true,
          data: defaultSettings,
        };
      }
    } catch (error: any) {
      console.error("Error getting user settings:", error);
      return {
        success: false,
        error: error.message || "Failed to get settings",
      };
    }
  }

  async updateUserSettings(
    userId: string,
    settings: Partial<UserSettings>
  ): Promise<ApiResponse<UserSettings>> {
    try {
      const settingsRef = doc(db, "userSettings", userId);
      const updatedSettings = {
        ...settings,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(settingsRef, updatedSettings);

      // Get the updated settings
      const result = await this.getUserSettings(userId);
      return result;
    } catch (error: any) {
      console.error("Error updating user settings:", error);
      return {
        success: false,
        error: error.message || "Failed to update settings",
      };
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<string>> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      return {
        success: true,
        data: "Password updated successfully",
      };
    } catch (error: any) {
      console.error("Error changing password:", error);
      let errorMessage = "Failed to change password";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Current password is incorrect";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "New password is too weak";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please log out and log in again before changing password";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async deleteAccount(password: string): Promise<ApiResponse<string>> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          success: false,
          error: "User not authenticated",
        };
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore
      const userId = user.uid;
      const collections = [
        "users",
        "userSettings",
        "transactions",
        "budgets",
        "bills",
      ];

      for (const collection of collections) {
        try {
          const docRef = doc(db, collection, userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            await updateDoc(docRef, {
              deleted: true,
              deletedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn(`Failed to mark ${collection} for deletion:`, error);
        }
      }

      // Delete Firebase Auth user
      await deleteUser(user);

      return {
        success: true,
        data: "Account deleted successfully",
      };
    } catch (error: any) {
      console.error("Error deleting account:", error);
      let errorMessage = "Failed to delete account";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Password is incorrect";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage =
          "Please log out and log in again before deleting account";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async exportUserData(userId: string): Promise<ApiResponse<any>> {
    try {
      const collections = [
        "users",
        "transactions",
        "budgets",
        "bills",
        "userSettings",
      ];
      const exportData: any = {
        exportDate: new Date().toISOString(),
        userId: userId,
        data: {},
      };

      for (const collection of collections) {
        try {
          const docRef = doc(db, collection, userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            exportData.data[collection] = docSnap.data();
          }
        } catch (error) {
          console.warn(`Failed to export ${collection}:`, error);
        }
      }

      return {
        success: true,
        data: exportData,
      };
    } catch (error: any) {
      console.error("Error exporting user data:", error);
      return {
        success: false,
        error: error.message || "Failed to export data",
      };
    }
  }

  async clearCache(): Promise<ApiResponse<string>> {
    try {
      // Clear any cached data from AsyncStorage/local storage
      // This is a placeholder - you might want to clear specific cache items
      console.log("Cache cleared");

      return {
        success: true,
        data: "Cache cleared successfully",
      };
    } catch (error: any) {
      console.error("Error clearing cache:", error);
      return {
        success: false,
        error: error.message || "Failed to clear cache",
      };
    }
  }

  async getStorageUsage(): Promise<
    ApiResponse<{
      appData: number;
      cache: number;
      documents: number;
      total: number;
    }>
  > {
    try {
      // This is a mock implementation
      // In a real app, you'd calculate actual storage usage
      const usage = {
        appData: 45.2, // MB
        cache: 12.8, // MB
        documents: 3.4, // MB
        total: 61.4, // MB
      };

      return {
        success: true,
        data: usage,
      };
    } catch (error: any) {
      console.error("Error getting storage usage:", error);
      return {
        success: false,
        error: error.message || "Failed to get storage usage",
      };
    }
  }
}

export const settingsService = new SettingsService();
