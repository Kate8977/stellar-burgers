import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { SerializedError } from '@reduxjs/toolkit';
import type { RootState } from '@services/store';
import type { TIngredient } from '@utils-types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export const fetchIngredients = createAsyncThunk('ingredients/fetch', async () =>
  getIngredientsApi()
);

const initialState: TIngredientsState = {
  items: [],
  isLoading: true,
  error: null,
};

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.error = null;
        if (state.items.length === 0) {
          state.isLoading = true;
        }
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

export const selectIsIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState): SerializedError | null =>
  state.ingredients.error;
