import type { Locator, Page } from '@playwright/test';


export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  protected byTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }
}
