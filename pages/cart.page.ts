import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly checkoutButton = this.byTestId('checkout');
  private readonly itemNames = this.byTestId('inventory-item-name');

  constructor(page: Page) {
    super(page);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.byTestId(`remove-${productId}`).click();
  }

  async getItemNames(): Promise<string[]> {
    await this.checkoutButton.waitFor({ state: 'visible' });
    return this.itemNames.allTextContents();
  }
}
