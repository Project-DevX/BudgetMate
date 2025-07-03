import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AIState, AIInsight, MLPrediction } from '../../types';

const initialState: AIState = {
  insights: [],
  predictions: [],
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setInsights: (state, action: PayloadAction<AIInsight[]>) => {
      state.insights = action.payload;
    },
    addInsight: (state, action: PayloadAction<AIInsight>) => {
      state.insights.unshift(action.payload);
    },
    updateInsight: (state, action: PayloadAction<AIInsight>) => {
      const index = state.insights.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.insights[index] = action.payload;
      }
    },
    removeInsight: (state, action: PayloadAction<string>) => {
      state.insights = state.insights.filter(i => i.id !== action.payload);
    },
    setPredictions: (state, action: PayloadAction<MLPrediction[]>) => {
      state.predictions = action.payload;
    },
    addPrediction: (state, action: PayloadAction<MLPrediction>) => {
      state.predictions.push(action.payload);
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
  setInsights,
  addInsight,
  updateInsight,
  removeInsight,
  setPredictions,
  addPrediction,
  setLoading,
  setError,
  clearError,
} = aiSlice.actions;

export default aiSlice.reducer;
