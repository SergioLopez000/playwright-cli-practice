import { test, expect } from '../fixtures/pages.fixture';

test('standard_user can log out from the side menu', async ({ page, loginPage, sideMenuPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await sideMenuPage.logout();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
