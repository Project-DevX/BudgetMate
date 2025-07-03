# 🔥 Firebase Database Setup Guide for BudgetMate

## Overview

This guide will help you set up Firebase Firestore database for your BudgetMate app with proper collections, security rules, and indexes.

## 📋 What's Been Created

### ✅ Firebase Services

- **`firebaseTransactionService.ts`** - Complete CRUD operations for transactions
- **`firebaseAccountService.ts`** - Account management (checking, savings, credit cards)
- **`firebaseBudgetService.ts`** - Budget creation, tracking, and monitoring
- **All services include**:
  - Real-time listeners
  - User authentication checks
  - Error handling
  - TypeScript type safety

## 🗄️ Database Structure

### Collections in Firestore:

```
budgetmate-firestore/
├── users/
│   └── {userId}/
│       ├── id: string
│       ├── email: string
│       ├── name: string
│       ├── avatar?: string
│       ├── preferences: {...}
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── transactions/
│   └── {transactionId}/
│       ├── id: string
│       ├── userId: string (owner)
│       ├── accountId: string
│       ├── amount: number
│       ├── description: string
│       ├── category: string
│       ├── subcategory?: string
│       ├── date: timestamp
│       ├── type: 'income' | 'expense'
│       ├── merchant?: string
│       ├── tags: string[]
│       ├── isRecurring: boolean
│       ├── source: 'manual' | 'bank_api' | 'statement_upload'
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── accounts/
│   └── {accountId}/
│       ├── id: string
│       ├── userId: string (owner)
│       ├── name: string
│       ├── type: 'checking' | 'savings' | 'credit' | 'investment'
│       ├── balance: number
│       ├── currency: string
│       ├── bankName: string
│       ├── lastSynced: timestamp
│       ├── isActive: boolean
│       └── plaidAccountId?: string
│
├── budgets/
│   └── {budgetId}/
│       ├── id: string
│       ├── userId: string (owner)
│       ├── name: string
│       ├── category: string
│       ├── amount: number
│       ├── spent: number
│       ├── period: 'monthly' | 'weekly' | 'yearly'
│       ├── startDate: timestamp
│       ├── endDate: timestamp
│       ├── isActive: boolean
│       ├── alerts: BudgetAlert[]
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── bills/ (future)
    └── {billId}/
        ├── Similar structure for bills/subscriptions
        └── ...
```

## 🔒 Security Rules Setup

### Step 1: Go to Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `budgetmate-3b480`
3. Go to **Firestore Database** → **Rules**

### Step 2: Update Security Rules

Replace the default rules with these:

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

## 📊 Database Indexes Setup

### Step 3: Create Composite Indexes

Go to **Firestore Database** → **Indexes** and create these composite indexes:

#### For Transactions:

1. **Collection**: `transactions`

   - **Fields**: `userId` (Ascending), `date` (Descending)
   - **Query scope**: Collection

2. **Collection**: `transactions`

   - **Fields**: `userId` (Ascending), `category` (Ascending), `date` (Descending)
   - **Query scope**: Collection

3. **Collection**: `transactions`
   - **Fields**: `userId` (Ascending), `accountId` (Ascending), `date` (Descending)
   - **Query scope**: Collection

#### For Budgets:

4. **Collection**: `budgets`

   - **Fields**: `userId` (Ascending), `isActive` (Ascending), `startDate` (Descending)
   - **Query scope**: Collection

5. **Collection**: `budgets`
   - **Fields**: `userId` (Ascending), `category` (Ascending), `isActive` (Ascending)
   - **Query scope**: Collection

#### For Accounts:

6. **Collection**: `accounts`
   - **Fields**: `userId` (Ascending), `isActive` (Ascending), `name` (Ascending)
   - **Query scope**: Collection

## 🚀 Integration Steps

### Step 4: Update Your Redux Slices

Now you need to update your Redux slices to use Firebase instead of API calls:

#### Example for Transaction Slice:

```typescript
// In src/store/slices/transactionSlice.ts
import { firebaseTransactionService } from "../../services/firebaseTransactionService";

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (transactionData: CreateTransactionData, { rejectWithValue }) => {
    try {
      const response = await firebaseTransactionService.createTransaction(
        transactionData
      );
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Step 5: Update Your Screens

Replace API service calls with Firebase service calls in your screens:

```typescript
// Example in AddTransactionScreen.tsx
import { firebaseTransactionService } from "../services/firebaseTransactionService";

const handleSaveTransaction = async () => {
  const result = await firebaseTransactionService.createTransaction({
    accountId: selectedAccount,
    amount: parseFloat(amount),
    description,
    category: selectedCategory,
    date: transactionDate.toISOString(),
    type: transactionType,
    tags: [],
    isRecurring: false,
    source: "manual",
    confidence: 1,
  });

  if (result.success) {
    // Transaction created successfully
    navigation.goBack();
  } else {
    // Handle error
    alert(result.error);
  }
};
```

## 🎯 Next Steps

### Priority Order:

1. **Set up Security Rules** (Most Important)
2. **Create Database Indexes** (For Performance)
3. **Test Transaction Creation** (Core Feature)
4. **Update Redux Slices** (State Management)
5. **Update Screens** (UI Integration)

### Testing Your Setup:

1. Start your app: `npm start`
2. Register a new user or login
3. Try creating a transaction manually
4. Check Firebase Console to see if data appears

## 📝 Usage Examples

### Creating a Transaction:

```typescript
const result = await firebaseTransactionService.createTransaction({
  accountId: "account-123",
  amount: -50.0,
  description: "Grocery shopping",
  category: "Food & Dining",
  date: new Date().toISOString(),
  type: "expense",
  merchant: "Walmart",
  tags: ["groceries", "essentials"],
  isRecurring: false,
  source: "manual",
  confidence: 1,
});
```

### Real-time Transaction Updates:

```typescript
const unsubscribe = firebaseTransactionService.subscribeToTransactions(
  (transactions) => {
    // Update your UI with new transactions
    setTransactions(transactions);
  }
);

// Don't forget to unsubscribe when component unmounts
return () => unsubscribe();
```

## 🔥 Ready to Connect!

Your Firebase services are ready. Follow the steps above to:

1. Set up security rules
2. Create indexes
3. Start integrating with your app

The foundation is solid - now let's make it work with your UI! 🚀
