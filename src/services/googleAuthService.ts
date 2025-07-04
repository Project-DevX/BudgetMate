import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, ApiResponse } from '../types';

// Complete auth session for proper cleanup
WebBrowser.maybeCompleteAuthSession();

export class GoogleAuthService {
  // Get the appropriate redirect URI based on environment
  private getRedirectUri(): string {
    if (__DEV__) {
      // For development: Use Expo's proxy redirect URI
      // This works consistently regardless of dev server IP/port changes
      return AuthSession.makeRedirectUri();
    } else {
      // For production: Use custom scheme
      return AuthSession.makeRedirectUri({
        scheme: 'budgetmate',
      });
    }
  }
  // Convert Firebase user to our User type
  private async convertFirebaseUser(firebaseUser: any): Promise<User> {
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

  // Google Sign-In using Expo AuthSession
  async signInWithGoogle(): Promise<
    ApiResponse<{ user: User; token: string; refreshToken: string }>
  > {
    try {
      const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Web Client ID not configured. Please add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your environment variables.');
      }

      // Get the appropriate redirect URI for current environment
      const redirectUri = this.getRedirectUri();

      console.log('Environment:', __DEV__ ? 'Development' : 'Production');
      console.log('Redirect URI:', redirectUri);

      // Create the auth URL manually to avoid PKCE issues
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=id_token&` +
        `scope=${encodeURIComponent('openid profile email')}&` +
        `nonce=${Math.random().toString(36).substring(2, 15)}`;

      console.log('Auth URL:', authUrl);

      // Open the auth session
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      console.log('Auth result:', result);

      if (result.type === 'success' && result.url) {
        // Extract the ID token from the URL fragment
        const url = new URL(result.url);
        const fragment = url.hash.substring(1);
        const params = new URLSearchParams(fragment);
        const idToken = params.get('id_token');

        if (!idToken) {
          throw new Error('No ID token received from Google');
        }

        // Create a Google credential with the ID token
        const googleCredential = GoogleAuthProvider.credential(idToken);

        // Sign in with Firebase using the Google credential
        const userCredential = await signInWithCredential(auth, googleCredential);

        // Check if this is a new user and create user document if needed
        const userDocRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // Create user document for new Google users
          const newUserDoc = {
            name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || '',
            email: userCredential.user.email || '',
            avatar: userCredential.user.photoURL,
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

          await setDoc(userDocRef, newUserDoc);
        }

        const user = await this.convertFirebaseUser(userCredential.user);
        const token = await userCredential.user.getIdToken();
        const refreshToken = userCredential.user.refreshToken;

        return {
          success: true,
          data: { user, token, refreshToken },
        };
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Google Sign-In was cancelled by the user',
        };
      } else {
        throw new Error('Google Sign-In failed');
      }
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      return {
        success: false,
        error: this.handleGoogleSignInError(error),
      };
    }
  }

  // Handle Google Sign-In specific errors
  private handleGoogleSignInError(error: any): string {
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
export const googleAuthService = new GoogleAuthService();
