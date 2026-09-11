import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  private readonly cartLink = this.byTestId('shopping-cart-link');
  private readonly cartBadge = this.byTestId('shopping-cart-badge');
  private readonly sortSelect = this.byTestId('product-sort-container');
  private readonly productPrices = this.byTestId('inventory-item-price');

  constructor(page: Page) {
    super(page);
  }

  async addToCart(productId: string): Promise<void> {
    await this.byTestId(`add-to-cart-${productId}`).click();
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.byTestId(`remove-${productId}`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption(option);
  }

  async getProductPrices(): Promise<number[]> {
    const texts = await this.productPrices.allTextContents();
    return texts.map((text) => Number(text.replace('$', '')));
  }
}
