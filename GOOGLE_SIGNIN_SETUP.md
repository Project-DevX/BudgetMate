# Google Sign-In with Firebase Setup Guide for BudgetMate

## Overview

This guide walks you through implementing Google Sign-In with Firebase authentication in your React Native Expo app.

## 🔥 Firebase Console Setup

### Step 1: Enable Google Sign-In in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `budgetmate-3b480`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. Toggle **Enable** to ON
6. Set **Project support email** (required)
7. Click **Save**

### Step 2: Get Google Web Client ID

1. In the Google provider settings, you'll see **Web SDK configuration**
2. Copy the **Web client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
3. Update your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-actual-web-client-id.googleusercontent.com
   ```

## 📱 Implementation Details

### What I've Already Implemented:

#### 1. **Installed Dependencies**

- `@react-native-google-signin/google-signin` ✅

#### 2. **Updated Firebase Auth Service**

- Added Google Sign-In configuration
- Created `signInWithGoogle()` method
- Handles user document creation for new Google users

#### 3. **Updated Redux Auth Slice**

- Added `loginWithGoogle` async thunk
- Added reducers for Google Sign-In states (pending, fulfilled, rejected)

#### 4. **Updated Login Screen**

- Added Google Sign-In button with Material Icons
- Added "OR" divider between email/password and Google sign-in
- Proper loading states and error handling

## 🚀 Testing the Implementation

### For Expo Go (Recommended for Testing):

1. Update your `.env` with the actual Google Web Client ID
2. Start your development server:
   ```bash
   npm run start
   ```
3. Open in Expo Go on your device
4. Test the Google Sign-In button

### For Production Build:

- For production, you'll need to configure additional platform-specific settings
- iOS: Add URL schemes to `app.json`
- Android: Add SHA certificates to Firebase project

## 🔧 Configuration Files Updated

### 1. **firebaseAuthService.ts**

```typescript
// Added Google Sign-In method
async signInWithGoogle(): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>>
```

### 2. **authSlice.ts**

```typescript
// Added Google Sign-In thunk
export const loginWithGoogle = createAsyncThunk(...)
```

### 3. **LoginScreen.tsx**

```typescript
// Added Google Sign-In button and handler
const handleGoogleSignIn = () => {
  dispatch(loginWithGoogle());
};
```

### 4. **.env**

```properties
# Added Google configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.googleusercontent.com
```

## 🎯 Next Steps

### Immediate (Required):

1. **Get your actual Google Web Client ID** from Firebase Console
2. Replace `your-web-client-id.googleusercontent.com` in `.env`
3. Test the Google Sign-In functionality

### Optional Enhancements:

1. **Add Google Sign-In to RegisterScreen**
2. **Handle account linking** (when user has both email/password and Google accounts)
3. **Add platform-specific configurations** for production builds
4. **Implement Google Sign-Out** properly

## 🐛 Troubleshooting

### Common Issues:

1. **"Google Sign-In failed"**

   - Check if Google provider is enabled in Firebase Console
   - Verify Web Client ID is correct
   - Ensure you're testing on a real device (Google Sign-In doesn't work well in simulators)

2. **"Failed to get Google ID token"**

   - Make sure Google Play Services are available on the device
   - Check network connectivity

3. **Firebase errors**
   - Verify Firebase configuration in `.env`
   - Check Firebase project is active and billing is enabled (if required)

## 📋 Testing Checklist

- [ ] Google provider enabled in Firebase Console
- [ ] Web Client ID added to `.env`
- [ ] App builds without errors
- [ ] Google Sign-In button appears on login screen
- [ ] Button shows loading state when pressed
- [ ] Success: User gets logged in and redirected to main app
- [ ] Error: Proper error message shown to user

## 🔐 Security Notes

- Never commit actual API keys to version control
- Use environment variables for all sensitive configuration
- Consider implementing additional security measures for production:
  - App integrity verification
  - Server-side token validation
  - Rate limiting

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all configuration steps are completed
3. Test on a real device (not simulator)
4. Check Firebase Console logs for detailed error messages

---

**Status**: ✅ Implementation Complete - Ready for Testing
**Next**: Update your Google Web Client ID and test the functionality!
