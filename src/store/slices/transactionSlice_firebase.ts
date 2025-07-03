import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  TransactionState,
  Transaction,
  TransactionFilters,
  PaginatedResponse,
} from "../../types";
import { firebaseTransactionService } from "../../services/firebaseTransactionService";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../constants";

// Initial state (same as before)
const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  filters: {
    dateRange: {
      startDate: format(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        DATE_FORMATS.API
      ),
      endDate: format(new Date(), DATE_FORMATS.API),
    },
    categories: [],
    accounts: [],
    amountRange: { min: 0, max: 10000 },
    search: "",
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

// 🔥 Firebase Async Thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    params: {
      filters?: Partial<TransactionFilters>;
      page?: number;
      limit?: number;
    } = {},
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { transactions: TransactionState };
      const filters = { ...state.transactions.filters, ...params.filters };
      const page = params.page || state.transactions.pagination.page;
      const limit = params.limit || state.transactions.pagination.limit;

      // 🔥 Use Firebase service instead of API service
      const response = await firebaseTransactionService.getTransactions(
        filters,
        page,
        limit
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch transactions");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch transactions");
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/createTransaction",
  async (
    transactionData: Omit<
      Transaction,
      "id" | "userId" | "createdAt" | "updatedAt"
    >,
    { rejectWithValue }
  ) => {
    try {
      console.log(
        "🔥 Creating transaction with Firebase service:",
        transactionData
      );
      // 🔥 Use Firebase service
      const response = await firebaseTransactionService.createTransaction(
        transactionData
      );
      if (response.success && response.data) {
        console.log(
          "🔥 Transaction created successfully in Firebase:",
          response.data
        );
        return response.data;
      }
      console.error("❌ Failed to create transaction:", response.error);
      return rejectWithValue(response.error || "Failed to create transaction");
    } catch (error: any) {
      console.error("❌ Error creating transaction:", error);
      return rejectWithValue(error.message || "Failed to create transaction");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    { id, data }: { id: string; data: Partial<Transaction> },
    { rejectWithValue }
  ) => {
    try {
      // 🔥 Use Firebase service
      const response = await firebaseTransactionService.updateTransaction(
        id,
        data
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to update transaction");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update transaction");
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue }) => {
    try {
      // 🔥 Use Firebase service
      const response = await firebaseTransactionService.deleteTransaction(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.error || "Failed to delete transaction");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete transaction");
    }
  }
);

// Bulk operations
export const bulkCreateTransactions = createAsyncThunk(
  "transactions/bulkCreateTransactions",
  async (
    transactions: Omit<
      Transaction,
      "id" | "userId" | "createdAt" | "updatedAt"
    >[],
    { rejectWithValue }
  ) => {
    try {
      // 🔥 Use Firebase bulk create
      const response = await firebaseTransactionService.bulkCreateTransactions(
        transactions
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(
        response.error || "Failed to bulk create transactions"
      );
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to bulk create transactions"
      );
    }
  }
);

export const getTransactionsByDateRange = createAsyncThunk(
  "transactions/getTransactionsByDateRange",
  async (
    { startDate, endDate }: { startDate: Date; endDate: Date },
    { rejectWithValue }
  ) => {
    try {
      // 🔥 Use Firebase date range query
      const response =
        await firebaseTransactionService.getTransactionsByDateRange(
          startDate,
          endDate
        );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(
        response.error || "Failed to get transactions by date range"
      );
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to get transactions by date range"
      );
    }
  }
);

// Transaction slice (rest remains the same)
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<typeof initialState.pagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    // 🔥 Add real-time transaction sync
    syncTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    // Additional local state management
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
    },
    updateTransactionInState: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasNextPage: action.payload.page < action.payload.totalPages,
          hasPreviousPage: action.payload.page > 1,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
        console.log("🔥 Transaction added to Redux store:", action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("❌ Transaction creation failed:", action.payload);
      });

    // Update transaction
    builder
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete transaction
    builder
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Bulk create transactions
    builder
      .addCase(bulkCreateTransactions.fulfilled, (state, action) => {
        state.transactions = [...action.payload, ...state.transactions];
      })
      .addCase(bulkCreateTransactions.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  clearError,
  syncTransactions,
  addTransaction,
  removeTransaction,
  updateTransactionInState,
} = transactionSlice.actions;

export default transactionSlice.reducer;
