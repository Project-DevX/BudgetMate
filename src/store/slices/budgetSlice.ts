import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BudgetState, Budget } from "../../types";
import { FirebaseBudgetService } from "../../services/firebaseBudgetService";

const budgetService = new FirebaseBudgetService();

// Async thunks
export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgets();
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to fetch budgets");
    } catch (error) {
      return rejectWithValue("Failed to fetch budgets");
    }
  }
);

export const createBudget = createAsyncThunk(
  "budgets/createBudget",
  async (
    budgetData: Omit<
      Budget,
      "id" | "userId" | "spent" | "createdAt" | "updatedAt"
    >,
    { rejectWithValue }
  ) => {
    try {
      const response = await budgetService.createBudget(budgetData);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.error || "Failed to create budget");
    } catch (error) {
      return rejectWithValue("Failed to create budget");
    }
  }
);

export const updateBudgetAsync = createAsyncThunk(
  "budgets/updateBudget",
  async (
    { budgetId, updates }: { budgetId: string; updates: Partial<Budget> },
    { rejectWithValue }
  ) => {
    try {
      const response = await budgetService.updateBudget(budgetId, updates);
      if (response.success) {
        return { budgetId, updates };
      }
      return rejectWithValue(response.error || "Failed to update budget");
    } catch (error) {
      return rejectWithValue("Failed to update budget");
    }
  }
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (budgetId: string, { rejectWithValue }) => {
    try {
      const response = await budgetService.deleteBudget(budgetId);
      if (response.success) {
        return budgetId;
      }
      return rejectWithValue(response.error || "Failed to delete budget");
    } catch (error) {
      return rejectWithValue("Failed to delete budget");
    }
  }
);

export const toggleBudgetStatus = createAsyncThunk(
  "budgets/toggleBudgetStatus",
  async (
    { budgetId, isActive }: { budgetId: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await budgetService.updateBudget(budgetId, { isActive });
      if (response.success) {
        return { budgetId, isActive };
      }
      return rejectWithValue(
        response.error || "Failed to toggle budget status"
      );
    } catch (error) {
      return rejectWithValue("Failed to toggle budget status");
    }
  }
);

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
  currentPeriod: "monthly",
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    removeBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter((b) => b.id !== action.payload);
    },
    setCurrentPeriod: (state, action: PayloadAction<string>) => {
      state.currentPeriod = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create budget
      .addCase(createBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets.push(action.payload);
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update budget
      .addCase(updateBudgetAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBudgetAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { budgetId, updates } = action.payload;
        const index = state.budgets.findIndex((b) => b.id === budgetId);
        if (index !== -1) {
          state.budgets[index] = { ...state.budgets[index], ...updates };
        }
      })
      .addCase(updateBudgetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete budget
      .addCase(deleteBudget.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.budgets = state.budgets.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle budget status
      .addCase(toggleBudgetStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleBudgetStatus.fulfilled, (state, action) => {
        state.loading = false;
        const { budgetId, isActive } = action.payload;
        const index = state.budgets.findIndex((b) => b.id === budgetId);
        if (index !== -1) {
          state.budgets[index].isActive = isActive;
        }
      })
      .addCase(toggleBudgetStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setBudgets,
  addBudget,
  updateBudget,
  removeBudget,
  setCurrentPeriod,
  setLoading,
  setError,
  clearError,
} = budgetSlice.actions;

export default budgetSlice.reducer;
