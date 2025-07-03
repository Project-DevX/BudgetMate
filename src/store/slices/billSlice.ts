import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillState, Bill } from '../../types';

const initialState: BillState = {
  bills: [],
  upcomingBills: [],
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload;
    },
    setUpcomingBills: (state, action: PayloadAction<Bill[]>) => {
      state.upcomingBills = action.payload;
    },
    addBill: (state, action: PayloadAction<Bill>) => {
      state.bills.push(action.payload);
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    removeBill: (state, action: PayloadAction<string>) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
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
  setBills,
  setUpcomingBills,
  addBill,
  updateBill,
  removeBill,
  setLoading,
  setError,
  clearError,
} = billSlice.actions;

export default billSlice.reducer;
