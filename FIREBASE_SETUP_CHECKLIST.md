# ✅ Firebase Setup Checklist - Follow This Step by Step

Print this out or keep it open while you set up Firebase!

## 🎯 Pre-Setup Checklist

- [ ] Google account ready
- [ ] Web browser open
- [ ] VS Code with your project open
- [ ] About 20 minutes of time

---

## 📋 Step-by-Step Checklist

### Step 1: Access Firebase Console

- [ ] Go to: https://console.firebase.google.com/
- [ ] Sign in with Google account
- [ ] Find and click your project: **budgetmate-3b480**
- [ ] See the Firebase dashboard

### Step 2: Create/Access Firestore Database

- [ ] Click "Firestore Database" in left sidebar
- [ ] If no database exists, click "Create database"
- [ ] Choose "Production mode" (NOT test mode)
- [ ] Select location (us-central1 recommended for US)
- [ ] Click "Done"
- [ ] See database interface with Data/Rules/Indexes tabs

### Step 3: Set Up Security Rules ⚠️ CRITICAL

- [ ] Click "Rules" tab
- [ ] Select ALL existing text (Ctrl+A)
- [ ] Delete everything
- [ ] Copy the security rules from the guide
- [ ] Paste the new rules
- [ ] Click "Publish" button
- [ ] See "Rules published successfully" message

### Step 4: Create Database Indexes (Create all 6)

#### Index 1 - Transactions by Date

- [ ] Click "Indexes" tab
- [ ] Click "Composite" sub-tab
- [ ] Click "Create index"
- [ ] Collection ID: `transactions`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `date` (Descending)
- [ ] Click "Create"
- [ ] Wait for "Building..." to change to "Enabled"

#### Index 2 - Transactions by Category

- [ ] Click "Create index" again
- [ ] Collection ID: `transactions`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `category` (Ascending)
- [ ] Add field: `date` (Descending)
- [ ] Click "Create"
- [ ] Wait for "Enabled" status

#### Index 3 - Transactions by Account

- [ ] Click "Create index" again
- [ ] Collection ID: `transactions`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `accountId` (Ascending)
- [ ] Add field: `date` (Descending)
- [ ] Click "Create"
- [ ] Wait for "Enabled" status

#### Index 4 - Active Budgets

- [ ] Click "Create index" again
- [ ] Collection ID: `budgets`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `isActive` (Ascending)
- [ ] Add field: `startDate` (Descending)
- [ ] Click "Create"
- [ ] Wait for "Enabled" status

#### Index 5 - Budgets by Category

- [ ] Click "Create index" again
- [ ] Collection ID: `budgets`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `category` (Ascending)
- [ ] Add field: `isActive` (Ascending)
- [ ] Click "Create"
- [ ] Wait for "Enabled" status

#### Index 6 - Active Accounts

- [ ] Click "Create index" again
- [ ] Collection ID: `accounts`
- [ ] Add field: `userId` (Ascending)
- [ ] Add field: `isActive` (Ascending)
- [ ] Add field: `name` (Ascending)
- [ ] Click "Create"
- [ ] Wait for "Enabled" status

### Step 5: Verify All Indexes are Ready

- [ ] All 6 indexes show "Enabled" status (not "Building...")
- [ ] No error messages in Firebase Console

### Step 6: Test Your App

- [ ] Open terminal in VS Code
- [ ] Run: `npm start`
- [ ] App starts without Firebase errors
- [ ] Try logging in or registering
- [ ] No error messages in browser console (F12)

### Step 7: Verify Database Connection

- [ ] Go back to Firebase Console
- [ ] Click "Data" tab in Firestore
- [ ] Use your app (register, try to create data)
- [ ] See collections appear in Firebase Console

---

## 🚨 Troubleshooting Checklist

### If you see "Permission denied" errors:

- [ ] Double-check security rules were pasted correctly
- [ ] Make sure you clicked "Publish" after updating rules
- [ ] Verify user is logged in to your app

### If you see "Index not found" errors:

- [ ] Check all 6 indexes show "Enabled" (not "Building...")
- [ ] Wait a few more minutes for indexes to finish building
- [ ] Refresh the Firebase Console page

### If app won't connect to Firebase:

- [ ] Check `.env` file has correct Firebase config values
- [ ] Verify Firebase project is active (not deleted/suspended)
- [ ] Check internet connection

### If you can't find your project:

- [ ] Make sure you're signed in with correct Google account
- [ ] Check project name is exactly: budgetmate-3b480
- [ ] Verify project wasn't accidentally deleted

---

## ✅ Success Indicators

### You know everything is working when:

- [ ] ✅ App starts without any Firebase errors
- [ ] ✅ You can register new users
- [ ] ✅ You can log in existing users
- [ ] ✅ Security rules show "Published" status
- [ ] ✅ All 6 indexes show "Enabled" status
- [ ] ✅ No error messages in browser console
- [ ] ✅ Collections appear in Firebase Console when you use app features

---

## 🎉 Completion Checklist

### Final verification:

- [ ] Firebase Console shows your project
- [ ] Firestore Database is created
- [ ] Security rules are published
- [ ] All 6 indexes are enabled
- [ ] App connects to Firebase successfully
- [ ] User authentication works
- [ ] Ready to create transactions, accounts, and budgets

### 🎯 You're Done!

If all boxes are checked, your Firebase database is ready to power your BudgetMate app!

---

**Time to complete:** 15-20 minutes  
**Difficulty:** Beginner-friendly  
**Next step:** Start using your app and watch data appear in Firebase! 🚀
