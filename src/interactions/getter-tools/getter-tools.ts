import { Page } from "playwright";
import { login } from "./getter-tools-common";
import { Coordinate, FindInactivePlayerOptions } from "./getter-tools-types";

export const findCoordinatesForInactivePlayers = async (page: Page, options: FindInactivePlayerOptions): Promise<Coordinate[]> => {
    await login(page);

    // click on close ad if present
    try {
        await page.frameLocator('iframe[name="aswift_3"]')
            .frameLocator('iframe[name="ad_iframe"]')
            .locator('[aria-label="Close\\ ad"]')
            .click({ timeout: 5000 });
    } catch (error) {
        console.info('No ads present on inactive player page');
    }

    // get to advanced inactive search tool
    await page.locator('[href="/ts2.x1.europe.travian.com.2/2-Region-Inactives"] > span').click();
    await page.locator('.absatzBack > a.abs').click();

    // fill in data for inactive player search
    await page.locator('#xyX').fill(options.departure.x.toString());
    await page.locator('#xyY').fill(options.departure.y.toString());
    await page.locator('#range').fill(options.range.toString());
    await page.locator('#maxSpielerCitys').fill(options.maxVillages.toString());
    await page.locator('#minSpielerEW').fill(options.minPopulation.toString());
    await page.locator('#maxSpielerEW').fill(options.maxPopulation.toString());
    await page.locator('#nataren').setChecked(options.includeNatars);

    // search and parse result
    await page.locator('[colspan="2"] > .stylebutton').click();
    const coordinates = await page.locator('tbody').locator('.koord').allTextContents();

    return parseCoordinates(coordinates);
};

const parseCoordinates = (coordinates: string[]): Coordinate[] => {
    const parseCoordinate = (coordinate: string): Coordinate => {
        const x = coordinate.split('|')[0].split('(')[1].trim();
        const y = coordinate.split('|')[1].split(')')[0].trim();

        return {
            x: parseInt(x),
            y: parseInt(y)
        };
    };

    return coordinates.map(coordinate => parseCoordinate(coordinate));
};