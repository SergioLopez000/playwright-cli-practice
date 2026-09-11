import { test, expect } from '../fixtures/pages.fixture';

test.describe('Inventory', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('adding products updates the cart badge count', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.addToCart('sauce-labs-bike-light');

    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('removing a product updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.removeFromCart('sauce-labs-backpack');

    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('sorting by price low to high orders products ascending', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getProductPrices();
    const ascending = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(ascending);
  });
});
