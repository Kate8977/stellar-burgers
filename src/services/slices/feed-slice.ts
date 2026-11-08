import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TFeedState, TOrder } from '@utils-types';

export const fetchFeeds = createAsyncThunk('feed/fetch', async () => getFeedsApi());

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.error = null;
        if (state.orders.length === 0) {
          state.isLoading = true;
        }
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось загрузить ленту заказов';
      });
  },
});

export const feedReducer = feedSlice.reducer;

export const selectFeed = (state: RootState): TFeedState => state.feed;

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
