import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
};

export const fetchProfileOrders = createAsyncThunk('profileOrders/fetch', async () =>
  getOrdersApi()
);

const initialState: TProfileOrdersState = {
  orders: [],
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    });
  },
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.profileOrders.orders;
