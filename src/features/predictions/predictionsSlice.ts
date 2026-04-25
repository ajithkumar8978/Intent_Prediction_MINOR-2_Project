import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PredictionResult, SessionData } from '../../types';
import { predictSalesIntent } from '../../lib/gemini';

interface PredictionsState {
  history: PredictionResult[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentResult: PredictionResult | null;
}

const generateMockHistory = (): PredictionResult[] => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: `mock-${i}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    sessionData: {
      timeSpent: Math.floor(Math.random() * 300) + 30,
      pagesVisited: Math.floor(Math.random() * 8) + 1,
      bounceRate: Math.floor(Math.random() * 100),
      trafficSource: ['Organic', 'Direct', 'Paid', 'Referral', 'Social'][Math.floor(Math.random() * 5)] as any,
      deviceType: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)] as any,
    },
    intent: Math.random() > 0.5 ? 'Yes' : 'No',
    confidenceScore: Math.floor(Math.random() * 40) + 60,
    reasoning: 'Simulated past prediction for dashboard analytics.',
  }));
};

const initialState: PredictionsState = {
  history: generateMockHistory(),
  status: 'idle',
  error: null,
  currentResult: null,
};

export const fetchPrediction = createAsyncThunk(
  'predictions/fetchPrediction',
  async (sessionData: SessionData) => {
    const response = await predictSalesIntent(sessionData);
    return response;
  }
);

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    clearCurrentResult: (state) => {
      state.currentResult = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrediction.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPrediction.fulfilled, (state, action: PayloadAction<PredictionResult>) => {
        state.status = 'succeeded';
        state.currentResult = action.payload;
        state.history.unshift(action.payload);
      })
      .addCase(fetchPrediction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to predict intent';
      });
  },
});

export const { clearCurrentResult } = predictionsSlice.actions;
export default predictionsSlice.reducer;
