# 🔧 Firebase Setup Troubleshooting - Common Issues & Solutions

## 🚨 Most Common Issues (95% of problems)

### Issue #1: "Permission denied" or "Missing or insufficient permissions"

**What it means:** Your security rules aren't set up correctly or user isn't authenticated.

**How to fix:**

1. **Go to Firebase Console** → Your project → Firestore Database → Rules
2. **Make sure your rules look EXACTLY like this:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /transactions/{transactionId} {
         allow read, write: if request.auth != null &&
           request.auth.uid == resource.data.userId;
         allow create: if request.auth != null &&
           request.auth.uid == request.resource.data.userId;
       }
       match /accounts/{accountId} {
         allow read, write: if request.auth != null &&
           request.auth.uid == resource.data.userId;
         allow create: if request.auth != null &&
           request.auth.uid == request.resource.data.userId;
       }
       match /budgets/{budgetId} {
         allow read, write: if request.auth != null &&
           request.auth.uid == resource.data.userId;
         allow create: if request.auth != null &&
           request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```
3. **Click "Publish"**
4. **Make sure you see "Rules published successfully"**

---

### Issue #2: "The query requires an index"

**What it means:** You need to create database indexes for faster queries.

**How to fix:**

1. **Look at the error message** - it will show you exactly what index to create
2. **Go to Firebase Console** → Firestore Database → Indexes → Composite
3. **Click the link in the error message** (it usually provides a direct link to create the index)
4. **OR create the 6 indexes manually** as shown in the setup guide
5. **Wait for indexes to show "Enabled"** (not "Building...")

---

### Issue #3: App crashes or shows Firebase connection errors

**What it means:** Your Firebase configuration might be wrong.

**How to fix:**

1. **Check your `.env` file** - make sure all Firebase values are correct:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   # ... etc
   ```
2. **Restart your app:**
   ```bash
   # Stop your app (Ctrl+C)
   npm start
   ```
3. **Check Firebase Console** - make sure your project is active and not suspended

---

## 🔍 How to Debug Issues

### Step 1: Check Browser Console

1. **Open your app in browser**
2. **Press F12** (or right-click → Inspect)
3. **Click "Console" tab**
4. **Look for red error messages**
5. **Copy the exact error message**

### Step 2: Check Firebase Console

1. **Go to Firebase Console**
2. **Check if your project is active**
3. **Look for any warning messages**
4. **Verify Firestore is enabled**

### Step 3: Check Your Code

1. **Look at VS Code terminal** for error messages
2. **Check if Firebase services are imported correctly**
3. **Verify user is logged in before trying to access data**

---

## 📋 Error Messages & Solutions

### "FirebaseError: 7 PERMISSION_DENIED"

**Solution:** Fix your security rules (see Issue #1 above)

### "FirebaseError: 9 FAILED_PRECONDITION: The query requires an index"

**Solution:** Create the missing index (see Issue #2 above)

### "FirebaseError: 5 NOT_FOUND: Requested entity was not found"

**Solution:**

- Make sure the document/collection exists
- Check if you're using the correct document ID
- Verify user owns the data they're trying to access

### "Auth object is null" or "User not authenticated"

**Solution:**

- Make sure user is logged in before accessing Firebase
- Check if authentication is working properly
- Verify Firebase Auth is enabled in your project

### "Network error" or "Failed to connect"

**Solution:**

- Check your internet connection
- Verify Firebase project is active
- Check if there are any Firebase service outages

---

## 🧪 Quick Tests to Verify Setup

### Test 1: Authentication Test

```javascript
// Add this to a button in your app
console.log("Current user:", firebaseAuthService.getCurrentUser());
```

**Expected result:** Should show user object or null

### Test 2: Database Connection Test

```javascript
// Try to read from database
import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const testConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
```

### Test 3: Security Rules Test

1. **Try to access data while logged out** - should fail
2. **Try to access another user's data** - should fail
3. **Try to access your own data while logged in** - should work

---

## 🆘 Getting More Help

### If you're still stuck:

1. **Check the exact error message** in browser console
2. **Take a screenshot** of the error
3. **Note which step you were on** when the error occurred
4. **Check Firebase Status page:** https://status.firebase.google.com/

### Common places to look for errors:

- Browser developer console (F12)
- VS Code terminal
- Firebase Console (look for warning icons)
- Network tab in browser dev tools

---

## ✅ Success Checklist

### Everything is working when:

- [ ] No red errors in browser console
- [ ] User can register and login
- [ ] App connects to Firebase without errors
- [ ] Security rules are published
- [ ] All indexes show "Enabled"
- [ ] Data appears in Firebase Console when you use the app

### 🎯 Most Important Things to Remember:

1. **Security rules MUST be set up correctly** (most common issue)
2. **Wait for indexes to finish building** before testing
3. **User must be logged in** to access their data
4. **Check browser console** for detailed error messages

If you follow these troubleshooting steps, you should be able to resolve 95% of Firebase setup issues! 🚀
