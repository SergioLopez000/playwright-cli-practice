import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutOverviewPage extends BasePage {
  private readonly finishButton = this.byTestId('finish');
  private readonly cancelButton = this.byTestId('cancel');

  constructor(page: Page) {
    super(page);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
