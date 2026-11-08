import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TConstructorState, TIngredient } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = { ...action.payload, id: crypto.randomUUID() };

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
        return;
      }

      state.ingredients.push(ingredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ index: number; step: -1 | 1 }>) => {
      const { index, step } = action.payload;
      const nextIndex = index + step;
      const items = state.ingredients;

      if (nextIndex < 0 || nextIndex >= items.length) return;

      [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;
