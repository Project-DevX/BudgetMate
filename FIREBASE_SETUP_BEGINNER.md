# 🔥 Firebase Database Setup - Beginner's Guide

## What is Firebase Firestore?

Firebase Firestore is Google's cloud database that stores your app's data. Think of it like having a database in the cloud that your app can read from and write to. It automatically syncs data across all devices in real-time.

## 📋 Before We Start

### What You Need:

1. A Google account (you probably already have one)
2. Your BudgetMate app project
3. About 15-20 minutes

### What We're Going to Do:

1. Set up the database structure (like creating folders for your data)
2. Set up security rules (who can access what data)
3. Create indexes (to make your app run faster)

---

## 🚀 Step 1: Access Firebase Console

### What to do:

1. Open your web browser
2. Go to: **https://console.firebase.google.com/**
3. Sign in with your Google account
4. You should see your project: **budgetmate-3b480**
5. Click on your project name

### What you'll see:

- A dashboard with various Firebase services
- Left sidebar with different options
- Your project overview in the center

---

## 🗄️ Step 2: Set Up Firestore Database

### What to do:

1. **In the left sidebar**, look for "Firestore Database"
2. **Click on "Firestore Database"**
3. If you haven't created a database yet, you'll see a "Create database" button
4. **Click "Create database"**

### Choose Database Mode:

You'll see two options:

- **Production mode** ← Choose this one
- Test mode

**Why Production mode?** We'll set up our own security rules, which is safer.

### Choose Database Location:

- Select a location close to where most of your users will be
- For US users: choose `us-central1` or `us-east1`
- **Click "Done"**

### What you'll see after:

- An empty database with tabs: "Data", "Rules", "Indexes", "Usage"

---

## 🔒 Step 3: Set Up Security Rules (VERY IMPORTANT!)

Security rules control who can read and write data in your database.

### What to do:

1. **Click on the "Rules" tab** (you should see it at the top)
2. You'll see a text editor with some default rules
3. **Select ALL the text** in the editor (Ctrl+A or Cmd+A)
4. **Delete everything**
5. **Copy and paste this code:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only access their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Users can only access their own accounts
    match /accounts/{accountId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Users can only access their own budgets
    match /budgets/{budgetId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }

    // Users can only access their own bills
    match /bills/{billId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

6. **Click "Publish"** (blue button)

### What these rules do:

- **Only signed-in users** can access data
- **Users can only see their own data** (not other people's transactions)
- **No unauthorized access** to anyone's financial information

---

## 📊 Step 4: Create Database Indexes (For Speed)

Indexes make your app load data faster, like an index in a book helps you find information quickly.

### What to do:

1. **Click on the "Indexes" tab**
2. You'll see "Single field" and "Composite" tabs
3. **Click on "Composite"** tab
4. **Click "Create index"** button

### Create These 6 Indexes (one by one):

#### Index 1 - Transactions by Date

1. **Collection ID**: `transactions`
2. Click "Add field":
   - **Field path**: `userId`
   - **Query scope**: Collection
   - **Order**: Ascending
3. Click "Add field" again:
   - **Field path**: `date`
   - **Query scope**: Collection
   - **Order**: Descending
4. Click "Create"

#### Index 2 - Transactions by Category

1. **Collection ID**: `transactions`
2. Add field: `userId` (Ascending)
3. Add field: `category` (Ascending)
4. Add field: `date` (Descending)
5. Click "Create"

#### Index 3 - Transactions by Account

1. **Collection ID**: `transactions`
2. Add field: `userId` (Ascending)
3. Add field: `accountId` (Ascending)
4. Add field: `date` (Descending)
5. Click "Create"

#### Index 4 - Active Budgets

1. **Collection ID**: `budgets`
2. Add field: `userId` (Ascending)
3. Add field: `isActive` (Ascending)
4. Add field: `startDate` (Descending)
5. Click "Create"

#### Index 5 - Budgets by Category

1. **Collection ID**: `budgets`
2. Add field: `userId` (Ascending)
3. Add field: `category` (Ascending)
4. Add field: `isActive` (Ascending)
5. Click "Create"

#### Index 6 - Active Accounts

1. **Collection ID**: `accounts`
2. Add field: `userId` (Ascending)
3. Add field: `isActive` (Ascending)
4. Add field: `name` (Ascending)
5. Click "Create"

### What you'll see:

- Each index will show "Building..." status
- After a few minutes, they'll show "Enabled" status
- **Wait for all indexes to show "Enabled" before continuing**

---

## 🧪 Step 5: Test Your Setup

### What to do:

1. **Go back to your code editor** (VS Code)
2. **Open a terminal** in your project
3. **Run your app**:
   ```bash
   npm start
   ```

### Test the basic setup:

1. **Register a new test user** or login with existing account
2. Try to navigate through your app
3. Check if authentication works

### What to look for:

- ✅ App starts without errors
- ✅ You can login/register
- ✅ No Firebase errors in the console

---

## 🔍 Step 6: Verify Database Connection

### Go back to Firebase Console:

1. **Click on "Data" tab** in Firestore
2. You should see collections starting to appear as you use your app

### What you might see:

- `users` collection (when someone registers)
- `transactions` collection (when someone adds a transaction)
- `accounts` collection (when someone adds an account)

### If you don't see data:

- That's normal if you haven't created any transactions yet
- The collections will appear when you first add data

---

## ❗ Common Issues & Solutions

### Issue 1: "Permission denied" errors

**Solution:** Double-check your security rules are exactly as provided above

### Issue 2: "Index not found" errors

**Solution:** Wait for all indexes to show "Enabled" status

### Issue 3: App won't connect to Firebase

**Solution:** Check your `.env` file has correct Firebase configuration

### Issue 4: Can't find your project

**Solution:** Make sure you're signed in with the same Google account used to create the project

---

## ✅ How to Know It's Working

### You'll know everything is set up correctly when:

1. ✅ Your app starts without Firebase errors
2. ✅ You can register/login users
3. ✅ Security rules are published
4. ✅ All 6 indexes show "Enabled"
5. ✅ You see collections appear in Firebase Console when you use features

---

## 🎯 What's Next?

Once your Firebase database is set up:

1. **Test creating a transaction** in your app
2. **Check Firebase Console** to see if the transaction appears
3. **Try the real-time features** - open your app on two devices and see changes sync

### Need Help?

If you get stuck on any step:

1. **Check the Firebase Console for error messages**
2. **Look at your browser's developer console** (F12)
3. **Take a screenshot** of any error messages you see

Your database is now ready to store and sync all your BudgetMate data! 🎉
