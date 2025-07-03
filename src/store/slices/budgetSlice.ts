import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BudgetState, Budget } from '../../types';

const initialState: BudgetState = {
  budgets: [],
  loading: false,
  error: null,
  currentPeriod: 'monthly',
};

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload;
    },
    addBudget: (state, action: PayloadAction<Budget>) => {
      state.budgets.push(action.payload);
    },
    updateBudget: (state, action: PayloadAction<Budget>) => {
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
    },
    removeBudget: (state, action: PayloadAction<string>) => {
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
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
