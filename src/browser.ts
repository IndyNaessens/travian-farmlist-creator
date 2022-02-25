import { Browser, chromium, Page } from 'playwright';

export const startBrowserAndOpenPage = async (): Promise<[Browser, Page]> => {
    const browser = await chromium.launch({
        headless: true,
        slowMo: 1000,
        chromiumSandbox: true
    });

    return [browser, await browser.newPage()];
};