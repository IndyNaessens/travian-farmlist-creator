import { Page } from "playwright";

export const login = async (page: Page): Promise<void> => {
    console.info('Logging in to Gettertools');

    await page.goto('https://www.gettertools.com/ts2.x1.europe.travian.com.2/');

    // accept cookies
    try {
        await page.locator('.-button-main').click({ timeout: 5000 });
    } catch (error) {
        console.debug('Cookies already accepted for Gettertools');
    }

    // login with form
    await page.locator('input[name="username"]').fill('u');
    await page.locator('input[name="password"]').fill('p');
    await page.locator('text=Login').nth(1).click();

    console.info('Logged in to Gettertools');
};