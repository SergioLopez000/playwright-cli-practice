import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SideMenuPage extends BasePage {
  private readonly openMenuButton = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink = this.byTestId('logout-sidebar-link');

  constructor(page: Page) {
    super(page);
  }

  async logout(): Promise<void> {
    await this.openMenuButton.click();
    await this.logoutLink.click();
  }
}
