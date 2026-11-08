import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

type TOrderDetailsState = {
  order: TOrder | null;
  requestNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderDetails/fetch',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const initialState: TOrderDetailsState = {
  order: null,
  requestNumber: null,
  isLoading: false,
  error: null,
};

const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.requestNumber = action.meta.arg;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        if (action.meta.arg !== state.requestNumber) return;

        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        if (action.meta.arg !== state.requestNumber) return;

        state.isLoading = false;
        state.order = null;
        state.error = action.error.message ?? 'Заказ не найден';
      });
  },
});

export const orderDetailsReducer = orderDetailsSlice.reducer;

export const selectViewedOrder = (state: RootState): TOrder | null =>
  state.orderDetails.order;

export const selectViewedOrderError = (state: RootState): string | null =>
  state.orderDetails.error;
