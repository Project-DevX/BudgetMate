import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, Alert } from '../../types';

const initialState: UIState = {
  theme: 'light',
  isDrawerOpen: false,
  loading: false,
  alerts: [],
  currentScreen: 'Dashboard',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentScreen: (state, action: PayloadAction<string>) => {
      state.currentScreen = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    markAlertAsRead: (state, action: PayloadAction<string>) => {
      const alert = state.alerts.find(a => a.id === action.payload);
      if (alert) {
        alert.isRead = true;
      }
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setDrawerOpen,
  toggleDrawer,
  setLoading,
  setCurrentScreen,
  addAlert,
  removeAlert,
  markAlertAsRead,
  clearAlerts,
} = uiSlice.actions;

export default uiSlice.reducer;
