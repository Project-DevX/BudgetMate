import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, Dashboard } from '../../types';

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action: PayloadAction<Dashboard>) => {
      state.data = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateDashboardData: (state, action: PayloadAction<Partial<Dashboard>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
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
    clearDashboard: (state) => {
      state.data = null;
      state.lastUpdated = null;
    },
  },
});

export const {
  setDashboardData,
  updateDashboardData,
  setLoading,
  setError,
  clearError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
