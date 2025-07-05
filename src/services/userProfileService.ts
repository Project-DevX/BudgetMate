import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { User, ApiResponse } from "../types";

export class UserProfileService {
  async updateProfile(
    userId: string,
    profileData: Partial<User>
  ): Promise<ApiResponse<User>> {
    try {
      const userRef = doc(db, "users", userId);

      // Remove fields that shouldn't be updated directly
      const { id, createdAt, ...updateData } = profileData;
      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(userRef, dataToUpdate);

      // Get the updated user data and merge with current auth data
      const updatedProfile = await this.getProfile(userId);
      return updatedProfile;
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        error: error.message || "Failed to update profile",
      };
    }
  }

  async getProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;

        // Merge with current auth user data for real-time fields
        const currentUser = auth.currentUser;
        const mergedData: User = {
          ...userData,
          id: userDoc.id,
          // Override with real-time auth data if available
          ...(currentUser && {
            email: currentUser.email || userData.email,
            name: currentUser.displayName || userData.name,
            avatar: currentUser.photoURL || userData.avatar,
            emailVerified: currentUser.emailVerified,
            // Add Google-specific fields from current auth user
            isGoogleAccount: currentUser.providerData.some(
              (provider) => provider.providerId === "google.com"
            ),
            googlePhotoURL: currentUser.photoURL || undefined,
            googleProfile: currentUser.providerData.some(
              (provider) => provider.providerId === "google.com"
            )
              ? {
                  picture: currentUser.photoURL || undefined,
                  verifiedEmail: currentUser.emailVerified,
                }
              : undefined,
          }),
        };

        return {
          success: true,
          data: mergedData,
        };
      } else {
        return {
          success: false,
          error: "User profile not found",
        };
      }
    } catch (error: any) {
      console.error("Error getting user profile:", error);
      return {
        success: false,
        error: error.message || "Failed to get profile",
      };
    }
  }

  async uploadAvatar(
    userId: string,
    avatarUri: string
  ): Promise<ApiResponse<string>> {
    try {
      // This is a placeholder for avatar upload functionality
      // In a real implementation, you would upload to Firebase Storage
      console.log("Avatar upload not implemented yet");
      return {
        success: false,
        error: "Avatar upload coming soon",
      };
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      return {
        success: false,
        error: error.message || "Failed to upload avatar",
      };
    }
  }
}

export const userProfileService = new UserProfileService();
