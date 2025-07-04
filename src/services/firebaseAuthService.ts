import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { User, ApiResponse } from "../types";
import { googleAuthService } from "./googleAuthService";

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userDoc);

      const user = await this.convertFirebaseUser(userCredential.user);
      const token = await userCredential.user.getIdToken();
      const refreshToken = userCredential.user.refreshToken;

      return {
        success: true,
        data: { user, token, refreshToken },
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
      const refreshToken = userCredential.user.refreshToken;

      return {
        success: true,
        data: { user, token, refreshToken },
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Google Sign-In using dedicated Google Auth Service
  async signInWithGoogle(): Promise<
    ApiResponse<{ user: User; token: string; refreshToken: string }>
  > {
    try {
      // Delegate to the specialized Google Auth Service
      return await googleAuthService.signInWithGoogle();
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        error: error.message || 'Google Sign-In failed',
      };
    }
  }

  // Enhanced logout
  async logout(): Promise<ApiResponse<void>> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
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
  }): Promise<ApiResponse<void>> {
    try {
      await confirmPasswordReset(auth, data.oobCode, data.password);
      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Change password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<void>> {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }

      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, newPassword);

      return {
        success: true,
        message: "Password updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Refresh token
  async refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }

      // Force refresh the token
      const token = await auth.currentUser.getIdToken(true);
      const user = await this.convertFirebaseUser(auth.currentUser);
      const newRefreshToken = auth.currentUser.refreshToken;

      return {
        success: true,
        data: { user, token, refreshToken: newRefreshToken },
      };
    } catch (error: any) {
      return {
        success: false,
        error: this.handleFirebaseError(error),
      };
    }
  }

  // Validate token
  async validateToken(
    token: string
  ): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user");
      }

      // Try to get a fresh token to validate current session
      const freshToken = await auth.currentUser.getIdToken();
      const user = await this.convertFirebaseUser(auth.currentUser);
      const refreshToken = auth.currentUser.refreshToken;

      return {
        success: true,
        data: { user, token: freshToken, refreshToken },
      };
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
      case "auth/popup-closed-by-user":
        return "Sign-in cancelled";
      case "auth/cancelled-popup-request":
        return "Sign-in cancelled";
      default:
        return error.message || "An unknown error occurred";
    }
  }

  // Handle Google Sign-In specific errors
  private handleGoogleSignInError(error: any): string {
    // AuthSession specific errors
    if (error.message?.includes('cancelled')) {
      return 'Google Sign-In was cancelled';
    }
    if (error.message?.includes('network')) {
      return 'Network error occurred during Google Sign-In';
    }
    if (error.message?.includes('Client ID')) {
      return 'Google Sign-In configuration error. Please check your setup.';
    }
    
    // Firebase auth errors
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In was cancelled';
      case 'auth/cancelled-popup-request':
        return 'Google Sign-In was cancelled';
      case 'auth/network-request-failed':
        return 'Network error occurred during Google Sign-In';
      default:
        return error.message || 'Google Sign-In failed';
    }
  }
}

// Export singleton instance
export const firebaseAuthService = new FirebaseAuthService();
