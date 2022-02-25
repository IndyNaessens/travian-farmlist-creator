import { Page } from "playwright";
import { login } from "./getter-tools-common";
import { Coordinate } from "./getter-tools-types";

export const findCoordinatesForInactivePlayers = async (page: Page): Promise<Coordinate[]> => {
    await login(page);

    // get to advanced inactive search tool
    await page.locator('[href="/ts2.x1.europe.travian.com.2/2-Region-Inactives"] > span').click();
    await page.locator('.absatzBack > a.abs').click();

    // fill in data for inactive player search
    await page.locator('#xyX').fill('75');
    await page.locator('#xyY').fill('-87');
    await page.locator('#range').fill('100');
    await page.locator('#maxSpielerCitys').fill('1');
    await page.locator('#maxSpielerEW').fill('100');
    await page.locator('#nataren').setChecked(true);
    await page.locator('#speed').fill('19');

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
            x: x,
            y: y
        };
    };

    return coordinates.map(coordinate => parseCoordinate(coordinate));
};