import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getErrorMessage } from '@utils/get-error-message';

import type { RootState } from '@services/store';
import type { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

export const createOrder = createAsyncThunk<TOrder, string[], { rejectValue: string }>(
  'order/create',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      const order = response.order;
      // В ответе на создание заказа ингредиенты приходят объектами, в ленте — строками id.
      const rawIngredients = order.ingredients as (string | { _id: string })[];

      return {
        ...order,
        ingredients: rawIngredients.map((item) =>
          typeof item === 'string' ? item : item._id
        ),
      };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const initialState: TOrderState = {
  order: null,
  orderRequest: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderRequest = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.order = null;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;

export const selectOrder = (state: RootState): TOrder | null => state.order.order;

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;

export const selectOrderError = (state: RootState): string | null => state.order.error;
