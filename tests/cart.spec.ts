import { test, expect } from '../fixtures/pages.fixture';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
  });

  test('removing an item from the cart page removes it from the list', async ({ cartPage }) => {
    await cartPage.removeFromCart('sauce-labs-backpack');

    expect(await cartPage.getItemNames()).not.toContain('Sauce Labs Backpack');
  });
});
