import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import transactionSlice from './slices/transactionSlice';
import budgetSlice from './slices/budgetSlice';
import billSlice from './slices/billSlice';
import accountSlice from './slices/accountSlice';
import dashboardSlice from './slices/dashboardSlice';
import aiSlice from './slices/aiSlice';
import uiSlice from './slices/uiSlice';
import { RootState } from '../types';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    transactions: transactionSlice,
    budgets: budgetSlice,
    bills: billSlice,
    accounts: accountSlice,
    dashboard: dashboardSlice,
    ai: aiSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
