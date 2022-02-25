import { Page } from "playwright";

export const login = async (page: Page): Promise<void> => {
    await page.goto('https://www.gettertools.com/ts2.x1.europe.travian.com.2/');

    // accept cookies
    await page.locator('.-button-main').click();

    // login with form
    await page.locator('input[name="username"]').fill('asdasd');
    await page.locator('input[name="password"]').fill('asdasd');
    await page.locator('text=Login').nth(1).click();
};