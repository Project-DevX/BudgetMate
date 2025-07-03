# 🧪 Quick Firebase Test - Create Test Data

Since you only see the `users` collection, let's create some test data to verify your Firebase setup is working and see the other collections appear.

## Option 1: Test in Browser Console (Quickest)

1. **Open your app in browser** (`npm start` then open in browser)
2. **Make sure you're logged in**
3. **Press F12** to open developer console
4. **Go to "Console" tab**
5. **Copy and paste this code:**

```javascript
// Test Firebase Transaction Service
(async function testFirebase() {
  try {
    // Import the service (adjust path if needed)
    const { firebaseTransactionService } = await import(
      "./src/services/firebaseTransactionService.js"
    );

    console.log("🔥 Testing Firebase Transaction Service...");

    // Create a test transaction
    const testTransaction = {
      accountId: "test-account-123",
      amount: -25.5,
      description: "Test Coffee Purchase",
      category: "Food & Dining",
      date: new Date().toISOString(),
      type: "expense",
      merchant: "Starbucks",
      tags: ["coffee", "test"],
      isRecurring: false,
      source: "manual",
      confidence: 1,
    };

    const result = await firebaseTransactionService.createTransaction(
      testTransaction
    );

    if (result.success) {
      console.log("✅ Test transaction created successfully!", result.data);
      console.log(
        '🎉 Now check Firebase Console - you should see a "transactions" collection!'
      );
    } else {
      console.error("❌ Failed to create transaction:", result.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
    console.log(
      "💡 Make sure you are logged in and Firebase services are imported correctly"
    );
  }
})();
```

6. **Press Enter** to run the code
7. **Check the output** for success/error messages
8. **Go back to Firebase Console** → Data tab and refresh to see if "transactions" collection appeared

## Option 2: Create Test Data Manually in Firebase Console

If the above doesn't work, you can manually create test data:

1. **Go to Firebase Console** → Your project → Firestore Database → Data
2. **Click "Start collection"**
3. **Collection ID:** `transactions`
4. **Click "Next"**
5. **Document ID:** Leave auto-generated
6. **Add these fields:**

| Field       | Type      | Value                                     |
| ----------- | --------- | ----------------------------------------- |
| userId      | string    | (copy your user ID from users collection) |
| accountId   | string    | test-account-123                          |
| amount      | number    | -25.50                                    |
| description | string    | Test Coffee Purchase                      |
| category    | string    | Food & Dining                             |
| type        | string    | expense                                   |
| date        | timestamp | (click calendar icon, select today)       |
| merchant    | string    | Starbucks                                 |
| tags        | array     | ["coffee", "test"]                        |
| isRecurring | boolean   | false                                     |
| source      | string    | manual                                    |
| confidence  | number    | 1                                         |
| createdAt   | timestamp | (click calendar icon, select now)         |
| updatedAt   | timestamp | (click calendar icon, select now)         |

7. **Click "Save"**

## Option 3: Quick Test Account Creation

Similarly, for accounts collection:

1. **Click "Start collection"** (if no other collections exist)
2. **Collection ID:** `accounts`
3. **Add these fields:**

| Field      | Type      | Value                 |
| ---------- | --------- | --------------------- |
| userId     | string    | (your user ID)        |
| name       | string    | Test Checking Account |
| type       | string    | checking              |
| balance    | number    | 1000.00               |
| currency   | string    | USD                   |
| bankName   | string    | Test Bank             |
| isActive   | boolean   | true                  |
| lastSynced | timestamp | (current time)        |

## What You Should See After Testing

After creating test data, you should see:

- ✅ `users` collection (already there)
- ✅ `transactions` collection (new)
- ✅ `accounts` collection (new)

## If Test Fails

### Common issues:

1. **User not logged in** - Make sure you're authenticated
2. **Security rules issue** - Check browser console for permission errors
3. **Import path wrong** - Firebase services might not be properly imported

### Check these:

1. **Browser console** for detailed error messages
2. **Firebase Console Rules tab** - make sure rules are published
3. **Your user ID** - copy it exactly from the users collection

## Next Steps

Once you see the collections appear:

1. ✅ **Your Firebase setup is working correctly**
2. ✅ **Security rules are working**
3. ✅ **Ready to integrate with your app screens**

The collections only appear when data is added - this is normal Firebase behavior! 🔥
