import { Page } from "playwright";

export const login = async (page: Page): Promise<void> => {
    console.info('Logging in to Travian');

    await page.goto('https://ts2.x1.europe.travian.com/login.php');

    // accept cookies
    try {
        await page.locator('text=Accept all').click({ timeout: 5000 });
    } catch (error) {
        console.debug('Cookies already accepted for Travian');
    };

    // login with form
    await page.locator('input[name="name"]').fill('u');
    await page.locator('input[name="password"]').fill('p');
    await page.locator('input[name="lowRes"]').check();

    await page.locator('button:has-text("Login")').click();

    console.info('Logged in to Travian');
};