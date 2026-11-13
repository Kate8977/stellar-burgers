import { fetchIngredients, ingredientsReducer } from './ingredients-slice';

import type { TIngredient } from '@utils-types';

const ingredient: TIngredient = {
  _id: 'ingredient-id',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
};

describe('редьюсер ингредиентов', (): void => {
  test('неизвестный экшен возвращает начальное состояние', (): void => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  test('pending включает загрузку и сбрасывает ошибку, пока список пуст', (): void => {
    const withError = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Не удалось загрузить'), 'rejected-id')
    );

    expect(
      ingredientsReducer(withError, fetchIngredients.pending('pending-id'))
    ).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  test('fulfilled сохраняет ингредиенты и выключает загрузку', (): void => {
    expect(
      ingredientsReducer(
        undefined,
        fetchIngredients.fulfilled([ingredient], 'fulfilled-id', undefined)
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  test('rejected сохраняет ошибку и выключает загрузку', (): void => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.rejected(new Error('Не удалось загрузить'), 'rejected-id')
    );

    expect(state.items).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error?.message).toBe('Не удалось загрузить');
  });
});
