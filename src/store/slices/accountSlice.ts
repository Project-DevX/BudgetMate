import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountState, Account, SyncStatus } from '../../types';

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
  syncStatus: {
    isSync: false,
    lastSyncTime: null,
    errors: [],
  },
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    addAccount: (state, action: PayloadAction<Account>) => {
      state.accounts.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.accounts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      state.accounts = state.accounts.filter(a => a.id !== action.payload);
    },
    setSyncStatus: (state, action: PayloadAction<SyncStatus>) => {
      state.syncStatus = action.payload;
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
  setAccounts,
  addAccount,
  updateAccount,
  removeAccount,
  setSyncStatus,
  setLoading,
  setError,
  clearError,
} = accountSlice.actions;

export default accountSlice.reducer;
