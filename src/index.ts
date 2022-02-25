import { chromium } from 'playwright';

const main = async () => {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000,
        chromiumSandbox: true
    });

    const page = await browser.newPage();
    await page.goto('https://www.gettertools.com/ts2.x1.europe.travian.com.2/');

};

main();