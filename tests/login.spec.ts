import { test, expect } from '../fixtures/pages.fixture';

test.describe('Login', () => {
  test('standard_user can log in with valid credentials', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('fake_user cannot log in', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('fake_user', 'secret_sauce');

    await expect(await loginPage.getErrorMessage()).toContain(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('locked_out_user sees a locked out error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('locked_out_user', 'secret_sauce');

    await expect(await loginPage.getErrorMessage()).toContain(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('empty username shows a required-field error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('', 'secret_sauce');

    await expect(await loginPage.getErrorMessage()).toContain('Epic sadface: Username is required');
  });
});
