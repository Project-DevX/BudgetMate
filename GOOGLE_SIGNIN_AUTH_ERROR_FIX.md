# 🚨 FIXING Google Sign-In Authorization Error

## The Error You're Seeing

```
Access blocked: Authorization Error
Parameter not allowed for this message type: code_challenge_method
Error 400: invalid_request
```

This error occurs because of OAuth flow configuration issues. Here's how to fix it:

## 🔧 Step-by-Step Fix

### 1. **Get Your Google Web Client ID** (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `budgetmate-3b480`
3. Go to **Authentication** → **Sign-in method**
4. Click on **Google** provider
5. If not enabled, enable it and set your support email
6. Copy the **Web client ID** from the "Web SDK configuration" section
7. Update your `.env` file:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-actual-client-id.googleusercontent.com
   ```

### 2. **Configure Redirect URIs in Google Cloud Console**

The authorization error happens because the redirect URI isn't whitelisted. You need to add Expo's redirect URIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `budgetmate-3b480`
3. Go to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (the web client)
5. Click **Edit**
6. In **Authorized redirect URIs**, add these URIs:

   **For Expo Development:**

   ```
   https://auth.expo.io/@your-expo-username/budgetmate
   exp://localhost:8081
   ```

   **For Web Development:**

   ```
   http://localhost:3000
   http://localhost:8081
   https://localhost:3000
   ```

   **For Production (when you deploy):**

   ```
   https://your-domain.com
   ```

### 3. **Find Your Expo Username**

If you don't know your Expo username:

```bash
npx expo whoami
```

Or check your Expo account at [expo.dev](https://expo.dev)

### 4. **Test the Fixed Implementation**

I've updated the Firebase auth service to:

- Remove PKCE configuration issues
- Add better error logging
- Use simpler OAuth flow
- Be more web-compatible

**Start your app:**

```bash
# For mobile testing
npm run start

# For web testing
npm run web
```

### 5. **If You Still Get Errors**

**Check the console logs** - the updated code will show:

- The redirect URI being used
- The auth result details
- Any specific error messages

**Common redirect URI formats:**

- **Expo Go**: `exp://127.0.0.1:8081`
- **Web**: `http://localhost:3000` or `http://localhost:8081`
- **Production**: Your actual domain

## 🎯 Quick Fix Checklist

- [ ] Web Client ID added to `.env` file
- [ ] Google provider enabled in Firebase Console
- [ ] Redirect URIs added to Google Cloud Console credentials
- [ ] App restarted after `.env` changes
- [ ] Testing on the correct platform (web vs mobile)

## 🔍 Debugging

If you're still having issues, check the browser console (F12) or the Expo logs for the exact redirect URI being used, then make sure that exact URI is added to your Google Cloud Console credentials.

The updated implementation includes better logging to help you debug the OAuth flow.

---

**Status**: 🛠️ Authorization Error Fix Applied
**Next**: Configure redirect URIs in Google Cloud Console
