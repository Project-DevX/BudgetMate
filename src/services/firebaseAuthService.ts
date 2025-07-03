import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  User as FirebaseUser,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { User, ApiResponse } from "../types";

export class FirebaseAuthService {
  // Listen to auth state changes
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    console.log("FirebaseAuthService: Setting up auth state listener");
    return onAuthStateChanged(auth, (user) => {
      console.log(
        "FirebaseAuthService: Auth state changed",
        user ? "User exists" : "No user"
      );
      callback(user);
    });
  }

  // Convert Firebase user to our User type
  private async convertFirebaseUser(firebaseUser: FirebaseUser): Promise<User> {
    const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
    const userData = userDoc.data();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email || "",
      name: firebaseUser.displayName || userData?.name || "",
      avatar: firebaseUser.photoURL || userData?.avatar,
      preferences: userData?.preferences || {
        currency: "USD",
        budgetCycle: "monthly",
        notifications: {
          billReminders: true,
          budgetAlerts: true,
          expenseAlerts: true,
          subscriptionAlerts: true,
        },
        categories: {
          customCategories: [],
          categoryRules: [],
        },
      },
      createdAt: userData?.createdAt || new Date().toISOString(),
      updatedAt: userData?.updatedAt || new Date().toISOString(),
    };
  }

  // Register with email and password
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<
    ApiResponse<{ user: User; token: string; refreshToken: string }>
  > {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: userData.name,
      });

      // Create user document in Firestore
      const userDoc = {
        name: userData.name,
        email: userData.email,
        preferences: {
          currency: "USD",
          budgetCycle: "monthly" as const,
          notifications: {
            billReminders: true,
            budgetAlerts: true,
            expenseAlerts: true,
            subscriptionAlerts: true,
          },
          categories: {
            customCategories: [],
            categoryRules: [],
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

      const user = await this.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      return {
        success: true,
        data: {
          user,
          token,
          refreshToken: userCredential.user.refreshToken || "",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Login with email and password
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<
    ApiResponse<{ user: User; token: string; refreshToken: string }>
  > {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = await this.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();

      return {
        success: true,
        data: {
          user,
          token,
          refreshToken: userCredential.user.refreshToken || "",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Logout
  async logout(): Promise<ApiResponse<boolean>> {
    try {
      await signOut(auth);
      return {
        success: true,
        data: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<string>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Reset password
  async resetPassword(data: {
    oobCode: string;
    password: string;
  }): Promise<ApiResponse<string>> {
    try {
      await confirmPasswordReset(auth, data.oobCode, data.password);
      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Refresh token (Firebase handles this automatically)
  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ token: string; user: User }>> {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken(true); // Force refresh
        const user = await this.convertFirebaseUser(auth.currentUser);
        return {
          success: true,
          data: { token, user },
        };
      }
      throw new Error("No current user");
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Validate token (check if user is authenticated)
  async validateToken(token: string): Promise<ApiResponse<{ user: User }>> {
    try {
      if (auth.currentUser) {
        const user = await this.convertFirebaseUser(auth.currentUser);
        return {
          success: true,
          data: { user },
        };
      }
      throw new Error("No authenticated user");
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Update user profile
  async updateUserProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }

      // Update Firebase Auth profile
      if (updates.name) {
        await updateProfile(auth.currentUser, {
          displayName: updates.name,
        });
      }

      // Update Firestore document
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      const user = await this.convertFirebaseUser(auth.currentUser);
      return {
        success: true,
        data: user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Handle Firebase errors
  private handleFirebaseError(error: any): string {
    switch (error.code) {
      case "auth/user-not-found":
        return "No account found with this email address";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password should be at least 6 characters";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return error.message || "An unknown error occurred";
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
