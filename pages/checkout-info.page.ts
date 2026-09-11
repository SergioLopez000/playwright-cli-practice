import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutInfoPage extends BasePage {
  private readonly firstNameInput = this.byTestId('firstName');
  private readonly lastNameInput = this.byTestId('lastName');
  private readonly postalCodeInput = this.byTestId('postalCode');
  private readonly continueButton = this.byTestId('continue');
  private readonly cancelButton = this.byTestId('cancel');
  private readonly errorMessage = this.byTestId('error');

  constructor(page: Page) {
    super(page);
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
