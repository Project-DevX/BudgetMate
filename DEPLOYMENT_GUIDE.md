# 🚀 BudgetMate Deployment Guide

## Expo Web Deployment Options

Your BudgetMate app has been successfully built for web! Here are several deployment options:

## Option 1: Netlify (Recommended)

### Quick Deploy with Drag & Drop
1. Go to [Netlify](https://netlify.com)
2. Drag and drop the `dist` folder to deploy
3. Your app will be live immediately!

### Continuous Deployment from Git
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build Command**: `npx expo export --platform web`
   - **Publish Directory**: `dist`
   - **Node Version**: 18

### Environment Variables for Netlify
Add these in Netlify dashboard > Site settings > Environment variables:
```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_google_client_id
```

## Option 2: Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Vercel will auto-detect Expo and configure build settings
3. Add the same environment variables in Vercel dashboard

## Option 3: GitHub Pages

1. Push your `dist` folder to a `gh-pages` branch
2. Enable GitHub Pages in repository settings
3. Point to the `gh-pages` branch

## Option 4: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## 🔧 Important Setup Steps

### 1. Update Google OAuth Redirect URIs

Add your deployed URL to Google Cloud Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized Redirect URIs:
   - `https://auth.expo.io/@himeth777/BudgetMate` (for development)
   - `https://your-deployed-url.netlify.app` (replace with actual URL)
   - `budgetmate://` (for mobile builds)

### 2. Update Firebase Configuration

Make sure your Firebase project allows your deployed domain:
1. Go to Firebase Console
2. Project Settings > General
3. Add your deployed domain to "Authorized domains"

### 3. Test Your Deployment

After deployment:
1. ✅ Check that the app loads
2. ✅ Test Google Sign-In functionality
3. ✅ Verify Firebase connectivity
4. ✅ Test all major features

## 📱 Mobile App Publishing

For native mobile apps, you'll need to use EAS Build:

### Android APK/AAB
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build for Android
eas build --platform android

# Submit to Google Play Store (optional)
eas submit --platform android
```

### iOS IPA
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store (optional)
eas submit --platform ios
```

## 🌐 Your App URLs

After deployment, your app will be available at:
- **Web**: https://your-domain.netlify.app
- **Expo Go**: exp://exp.host/@himeth777/BudgetMate
- **Development**: exp://10.33.127.29:8081 (local)

## 🔗 Next Steps

1. **Choose a deployment platform** (Netlify recommended)
2. **Deploy your app** using the `dist` folder
3. **Update Google OAuth** with your production URL
4. **Test all functionality** on the live site
5. **Share your app** with users!

## 🎯 Pro Tips

- **Custom Domain**: Most platforms allow custom domains
- **HTTPS**: Ensure your site uses HTTPS for OAuth to work
- **Environment Variables**: Never commit secrets to Git
- **Monitoring**: Set up error tracking (Sentry, LogRocket)
- **Analytics**: Add Google Analytics or similar

Your BudgetMate app is ready for the world! 🎉
