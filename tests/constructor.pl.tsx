import { expect, test, type Locator, type Page } from '@playwright/test';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const ORDER_NUMBER = '54321';

const mockApi = async (page: Page): Promise<void> => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    notFound: 'abort',
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
    notFound: 'abort',
  });
  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    notFound: 'abort',
  });
};

const constructor = (page: Page): Locator =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ' }),
  });

const addIngredient = async (page: Page, name: string): Promise<void> => {
  await page
    .locator('li')
    .filter({ hasText: name })
    .getByRole('button', { name: 'Добавить' })
    .click();
};

const setAuth = async (page: Page): Promise<void> => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer fake-access-token',
      url: 'http://localhost:4000',
    },
  ]);
  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });
};

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockApi(page);
  });

  test('булка добавляется сверху и снизу конструктора', async ({ page }) => {
    await page.goto('/');
    await addIngredient(page, BUN_NAME);

    await expect(constructor(page).getByText(`${BUN_NAME} (верх)`)).toBeVisible();
    await expect(constructor(page).getByText(`${BUN_NAME} (низ)`)).toBeVisible();
    await expect(constructor(page).getByText('Выберите булки')).toHaveCount(0);
  });

  test('начинка добавляется в середину конструктора', async ({ page }) => {
    await page.goto('/');
    await addIngredient(page, MAIN_NAME);

    await expect(constructor(page).getByText(MAIN_NAME)).toBeVisible();
    await expect(constructor(page).getByText('Выберите начинку')).toHaveCount(0);
  });

  test('модальное окно показывает выбранный ингредиент и закрывается по крестику', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: BUN_NAME }).click();

    const modal = page.locator('#modals');
    await expect(
      modal.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(modal.getByRole('heading', { name: BUN_NAME })).toBeVisible();
    await expect(modal.getByText('420')).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
  });

  test('модальное окно ингредиента закрывается по клику на оверлей', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: BUN_NAME }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByRole('heading', { name: BUN_NAME })).toBeVisible();
    await modal
      .locator('> div')
      .nth(1)
      .click({ position: { x: 8, y: 8 } });

    await expect(modal.getByRole('heading', { name: 'Детали ингредиента' })).toHaveCount(
      0
    );
  });

  test('авторизованный пользователь оформляет заказ, видит его номер, конструктор очищается', async ({
    page,
  }) => {
    await setAuth(page);
    await page.goto('/');

    await addIngredient(page, BUN_NAME);
    await addIngredient(page, MAIN_NAME);
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.locator('#modals');
    await expect(modal.getByRole('heading', { name: ORDER_NUMBER })).toBeVisible();
    await expect(constructor(page).getByText('Выберите булки')).toHaveCount(2);
    await expect(constructor(page).getByText('Выберите начинку')).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();
    await expect(modal.getByRole('heading', { name: ORDER_NUMBER })).toHaveCount(0);
  });
});
