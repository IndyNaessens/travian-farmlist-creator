import { Page } from "playwright";
import { Coordinate } from "../getter-tools/getter-tools-types";
import { login } from "./travian-common";

export const createFarmlist = async (page: Page, name: string, villageNumber: number, coordinates: Coordinate[]): Promise<void> => {
    await login(page);

    // go to farmlist
    await page.locator('text=Farmlist').click();

    for (let i = 0; i < coordinates.length; i += 100) {
        const start = i;
        const end = i + 100 > coordinates.length ? coordinates.length : i + 100;

        console.info(`Processing farms from ${start + 1} - ${end}`);
        await createFarmlistEntry(page, name, villageNumber, (i / 100) + 1, coordinates.slice(start, end));
    };
};

const createFarmlistEntry = async (page: Page, name: string, villageNumber: number, followNumber: number, coordinates: Coordinate[]) => {
    const farmlistName = `${villageNumber}. ${name} - ${followNumber}`;

    console.info(`Creating farmlist ${farmlistName}`);

    await page.locator('text=Creëer nieuwe lijst').nth(2).click();
    await page.locator('[placeholder="Lijstnaam"]').fill(farmlistName);
    await page.locator('input[name="t2"]').fill('5');
    await page.locator('button:has-text("Creëer")').click();

    // add coordinates to farmlist
    await page.locator(`text=${farmlistName}`).locator('../../../../..').locator('.collapsed').click();

    for (const coordinate of coordinates) {
        await addCoordinateToFarmlist(page, coordinate);
    };

    // collapse the list again
    await page.locator(`text=${farmlistName}`).locator('../../../../..').locator('.expanded').click();
};

const addCoordinateToFarmlist = async (page: Page, coordinate: Coordinate): Promise<void> => {
    console.info(`Adding coordinate x=${coordinate.x} and y=${coordinate.y}`);

    await page.locator('text=Voeg nieuwe farm toe').click();
    await page.locator('input[name="x"]').fill(coordinate.x.toString());
    await page.locator('input[name="y"]').fill(coordinate.y.toString());
    await page.locator('text=Opslaan').click();

    // small timeout to let the popup appear when a village does not exist
    await page.waitForTimeout(500);
    const villageDoesNotExistButton = page.locator('button:has-text("OK")');

    // continue when village does not exist (gettertools is not realtime data)
    if (await villageDoesNotExistButton.isVisible()) {
        console.warn(`Village with coordinate x=${coordinate.x} and y=${coordinate.y} does not exist`);

        // close both popups
        while (await page.locator('.dialogCancelButton').first().isVisible()) {
            await page.locator('.dialogCancelButton').first().click({ delay: 500 });
        };
    };
};