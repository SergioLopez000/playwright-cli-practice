import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameInput = this.byTestId('username');
  private readonly passwordInput = this.byTestId('password');
  private readonly loginButton = this.byTestId('login-button');
  private readonly errorMessage = this.byTestId('error');

  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string | null> {
    return this.errorMessage.textContent();
  }
}
