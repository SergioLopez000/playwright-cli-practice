import { test, expect } from '../fixtures/pages.fixture';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
  });

  test('standard_user can complete a purchase', async ({
    page,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await cartPage.checkout();

    await checkoutInfoPage.fillInfo('Sergio', 'Lopez', '28001');
    await checkoutInfoPage.continueToOverview();

    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('missing first name blocks checkout with a validation error', async ({
    cartPage,
    checkoutInfoPage,
  }) => {
    await cartPage.checkout();

    await checkoutInfoPage.fillInfo('', 'Lopez', '28001');
    await checkoutInfoPage.continueToOverview();

    await expect(await checkoutInfoPage.getErrorMessage()).toContain('Error: First Name is required');
  });

  test('cancel on the info step returns to the cart without losing items', async ({
    page,
    cartPage,
    checkoutInfoPage,
  }) => {
    await cartPage.checkout();
    await checkoutInfoPage.cancel();

    await expect(page).toHaveURL(/cart\.html/);
    expect(await cartPage.getItemNames()).toContain('Sauce Labs Backpack');
  });

  test('cancel on the overview step returns to the inventory page', async ({
    page,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
  }) => {
    await cartPage.checkout();
    await checkoutInfoPage.fillInfo('Sergio', 'Lopez', '28001');
    await checkoutInfoPage.continueToOverview();

    await checkoutOverviewPage.cancel();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
