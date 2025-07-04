# Google Sign-In Redirect URIs Configuration

This document explains the redirect URIs that need to be configured in Google Cloud Console for the BudgetMate app to work in both development and production environments.

## Redirect URIs to Add in Google Cloud Console

### 1. Development (Expo Proxy)
For development using Expo Go or Expo Development Build, add this exact URI:
```
https://auth.expo.io/@himeth777/BudgetMate
```

**Your Expo username is: `himeth777`**
**Your app slug is: `BudgetMate`**

### 2. Production (Custom Scheme)
For production builds (APK, AAB, IPA), add this URI:
```
budgetmate://
```

## How It Works

### Development Environment
- Uses Expo's authentication proxy service
- Redirect URI: `https://auth.expo.io/@username/BudgetMate`
- Benefits:
  - Consistent URL regardless of dev server IP/port changes
  - No need to update Google Cloud Console when dev server restarts
  - Works with Expo Go and development builds

### Production Environment
- Uses custom URL scheme defined in app.json
- Redirect URI: `budgetmate://`
- Benefits:
  - Direct deep linking into the app
  - No dependency on external proxy services
  - Standard approach for mobile OAuth

## Current Implementation

The app automatically detects the environment and uses the appropriate redirect URI:

```typescript
private getRedirectUri(): string {
  if (__DEV__) {
    // Development: Use Expo proxy
    return AuthSession.makeRedirectUri();
  } else {
    // Production: Use custom scheme
    return AuthSession.makeRedirectUri({
      scheme: 'budgetmate',
    });
  }
}
```

## Google Cloud Console Setup Steps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"
4. Click on your OAuth 2.0 Client ID
5. In the "Authorized redirect URIs" section, add BOTH URIs:
   - `https://auth.expo.io/@YOUR_EXPO_USERNAME/BudgetMate`
   - `budgetmate://`
6. Click "Save"

## Testing

### Development Testing
1. Run `npx expo start`
2. Open the app in Expo Go or development build
3. Try Google Sign-In
4. Check console logs for the redirect URI being used

### Production Testing
1. Build the app: `npx expo build:android` or `npx expo build:ios`
2. Install the built app on a device
3. Try Google Sign-In
4. Verify it uses the custom scheme redirect

## Troubleshooting

### Common Issues

1. **"invalid_request" error**
   - Check that the redirect URI is exactly as configured in Google Cloud Console
   - Ensure you've replaced YOUR_EXPO_USERNAME with your actual username

2. **"redirect_uri_mismatch" error**
   - The redirect URI in Google Cloud Console doesn't match what the app is sending
   - Check console logs to see what URI the app is trying to use

3. **Development redirect URI changes**
   - If you're still seeing dynamic IPs, ensure you're using the updated code that uses Expo proxy
   - Clear Expo cache: `npx expo start --clear`

### Debug Steps
1. Check console logs for "Redirect URI:" output
2. Verify the URI matches exactly what's in Google Cloud Console
3. Ensure your Expo username is correct
4. Check that both development and production URIs are added to Google Cloud Console

## Environment Variables

Make sure you have this in your `.env` file:
```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id.googleusercontent.com
```

The Web Client ID should be from the same Google Cloud project where you configured the redirect URIs.
