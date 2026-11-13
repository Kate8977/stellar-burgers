import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';

import type { TIngredient } from '@utils-types';

const ingredient = (patch: Partial<TIngredient>): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Ингредиент',
  type: 'main',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 1,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  ...patch,
});

const bun = ingredient({ _id: 'bun-id', name: 'Булка', type: 'bun' });
const anotherBun = ingredient({
  _id: 'another-bun-id',
  name: 'Другая булка',
  type: 'bun',
});
const firstFilling = ingredient({ _id: 'filling-1', name: 'Котлета' });
const secondFilling = ingredient({ _id: 'filling-2', name: 'Соус' });

describe('редьюсер конструктора бургера', (): void => {
  test('неизвестный экшен возвращает начальное состояние', (): void => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('addIngredient кладёт булку отдельно, а начинку в список', (): void => {
    const addBun = addIngredient(bun);
    const withBun = constructorReducer(undefined, addBun);
    const again = constructorReducer(undefined, addBun);

    expect(again).toEqual(withBun);
    expect(withBun.bun).toEqual(addBun.payload);
    expect(withBun.ingredients).toEqual([]);

    const replaced = constructorReducer(withBun, addIngredient(anotherBun));
    expect(replaced.bun?._id).toBe(anotherBun._id);

    const addFilling = addIngredient(firstFilling);
    const withFilling = constructorReducer(replaced, addFilling);

    expect(withFilling.ingredients).toEqual([addFilling.payload]);
  });

  test('removeIngredient удаляет выбранную начинку и сохраняет остальные', (): void => {
    const withFirst = constructorReducer(undefined, addIngredient(firstFilling));
    const withBoth = constructorReducer(withFirst, addIngredient(secondFilling));
    const firstAdded = withBoth.ingredients[0];
    const secondAdded = withBoth.ingredients[1];

    expect(
      constructorReducer(withBoth, removeIngredient(firstAdded.id)).ingredients
    ).toEqual([secondAdded]);
  });

  test('moveIngredient меняет порядок начинок и не выходит за границы', (): void => {
    const withFirst = constructorReducer(undefined, addIngredient(firstFilling));
    const withBoth = constructorReducer(withFirst, addIngredient(secondFilling));
    const moved = constructorReducer(withBoth, moveIngredient({ index: 0, step: 1 }));

    expect(moved.ingredients.map((item) => item._id)).toEqual([
      secondFilling._id,
      firstFilling._id,
    ]);
    expect(constructorReducer(withBoth, moveIngredient({ index: 0, step: -1 }))).toEqual(
      withBoth
    );
  });

  test('clearConstructor очищает булку и начинки', (): void => {
    const withBun = constructorReducer(undefined, addIngredient(bun));
    const filled = constructorReducer(withBun, addIngredient(firstFilling));

    expect(constructorReducer(filled, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
