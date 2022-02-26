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

    await page.locator('text=Creëer nieuwe lijst').first().click();
    await page.locator('[placeholder="Lijstnaam"]').fill(farmlistName);
    await page.locator('input[name="t4"]').fill('1');
    await page.locator('button:has-text("Creëer")').click();

    // add coordinates to farmlist
    await page.locator(`text=${farmlistName}`).locator('../../../../..').locator('.collapsed').click();

    for (const coordinate of coordinates) {
        await addCoordinateToFarmlist(page, coordinate);
    };
};

const addCoordinateToFarmlist = async (page: Page, coordinate: Coordinate): Promise<void> => {
    console.info(`Adding coordinate x=${coordinate.x} and y=${coordinate.y}`);

    await page.locator('text=Voeg nieuwe farm toe').click({ delay: 250 });
    await page.locator('input[name="x"]').fill(coordinate.x);
    await page.locator('input[name="y"]').fill(coordinate.y);
    await page.locator('text=Opslaan').click();

    // Click button:has-text("OK")
    const villageDoesNotExistButton = page.locator('button:has-text("OK")');

    // continue when village does not exist (gettertools is not realtime data)
    if (await villageDoesNotExistButton.isVisible()) {
        console.warn(`Village with coordinate x=${coordinate.x} and y=${coordinate.y} does not exist`);

        await villageDoesNotExistButton.click();
        await page.locator('.dialogCancelButton').click();
    };
};