import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  TransactionState,
  Transaction,
  TransactionFilters,
  PaginatedResponse,
} from "../../types";
import { FirebaseTransactionService } from "../../services/firebaseTransactionService";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../constants";

// Use Firebase service instead of API service
const firebaseTransactionService = new FirebaseTransactionService();

// Initial state
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

// Async thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (
    params?: {
      filters?: Partial<TransactionFilters>;
      page?: number;
      limit?: number;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { transactions: TransactionState };
      const filters = { ...state.transactions.filters, ...params?.filters };
      const page = params?.page || state.transactions.pagination.page;
      const limit = params?.limit || state.transactions.pagination.limit;

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
      const response = await firebaseTransactionService.createTransaction(
        transactionData
      );
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to create transaction");
    } catch (error: any) {
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

export const syncTransactions = createAsyncThunk(
  "transactions/syncTransactions",
  async (_, { rejectWithValue }) => {
    try {
      // TODO: Implement sync functionality with Firebase
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sync transactions");
    }
  }
);

export const categorizeTransactions = createAsyncThunk(
  "transactions/categorizeTransactions",
  async (transactionIds: string[], { rejectWithValue }) => {
    try {
      // TODO: Implement categorization with Firebase
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to categorize transactions"
      );
    }
  }
);

export const bulkCategorizeTransactions = createAsyncThunk(
  "transactions/bulkCategorizeTransactions",
  async (
    data: { transactionIds: string[]; category: string; subcategory?: string },
    { rejectWithValue }
  ) => {
    try {
      // TODO: Implement bulk categorization with Firebase
      return [];
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to bulk categorize transactions"
      );
    }
  }
);

export const searchTransactions = createAsyncThunk(
  "transactions/searchTransactions",
  async (query: string, { rejectWithValue }) => {
    try {
      // TODO: Implement search with Firebase
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search transactions");
    }
  }
);

// Transaction slice
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      state.pagination.total += 1;
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      state.pagination.total -= 1;
    },
    updateTransactionInList: (state, action: PayloadAction<Transaction>) => {
      const index = state.transactions.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
    },
    setDateRange: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string }>
    ) => {
      state.filters.dateRange = action.payload;
    },
    addCategoryFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.categories.includes(action.payload)) {
        state.filters.categories.push(action.payload);
      }
    },
    removeCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.categories = state.filters.categories.filter(
        (c) => c !== action.payload
      );
    },
    addAccountFilter: (state, action: PayloadAction<string>) => {
      if (!state.filters.accounts.includes(action.payload)) {
        state.filters.accounts.push(action.payload);
      }
    },
    removeAccountFilter: (state, action: PayloadAction<string>) => {
      state.filters.accounts = state.filters.accounts.filter(
        (a) => a !== action.payload
      );
    },
    setAmountRange: (
      state,
      action: PayloadAction<{ min: number; max: number }>
    ) => {
      state.filters.amountRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
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
        state.error = null;
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
        state.pagination.total += 1;
        state.error = null;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
        state.pagination.total -= 1;
        state.error = null;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Sync transactions
    builder
      .addCase(syncTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Add new transactions to the beginning of the list
        const newTransactions = action.payload.filter(
          (newTx) =>
            !state.transactions.some((existingTx) => existingTx.id === newTx.id)
        );
        state.transactions = [...newTransactions, ...state.transactions];
        state.pagination.total += newTransactions.length;
        state.error = null;
      })
      .addCase(syncTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Categorize transactions
    builder
      .addCase(categorizeTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(categorizeTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Update categorized transactions
        action.payload.forEach((updatedTx) => {
          const index = state.transactions.findIndex(
            (t) => t.id === updatedTx.id
          );
          if (index !== -1) {
            state.transactions[index] = updatedTx;
          }
        });
        state.error = null;
      })
      .addCase(categorizeTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Bulk categorize transactions
    builder
      .addCase(bulkCategorizeTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCategorizeTransactions.fulfilled, (state, action) => {
        state.loading = false;
        // Update bulk categorized transactions
        action.payload.forEach((updatedTx) => {
          const index = state.transactions.findIndex(
            (t) => t.id === updatedTx.id
          );
          if (index !== -1) {
            state.transactions[index] = updatedTx;
          }
        });
        state.error = null;
      })
      .addCase(bulkCategorizeTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Search transactions
    builder
      .addCase(searchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          hasNextPage: action.payload.page < action.payload.totalPages,
          hasPreviousPage: action.payload.page > 1,
        };
        state.error = null;
      })
      .addCase(searchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
  addTransaction,
  removeTransaction,
  updateTransactionInList,
  setDateRange,
  addCategoryFilter,
  removeCategoryFilter,
  addAccountFilter,
  removeAccountFilter,
  setAmountRange,
  setSearchQuery,
} = transactionSlice.actions;

export default transactionSlice.reducer;
