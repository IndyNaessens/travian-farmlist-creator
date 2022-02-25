import { startBrowserAndOpenPage } from './browser';
import { findCoordinatesForInactivePlayers } from './interactions/getter-tools/getter-tools';
import { createFarmlist } from './interactions/travian/travian';

const main = async () => {
    const [browser, page] = await startBrowserAndOpenPage();

    const coordinates = await findCoordinatesForInactivePlayers(page);
    console.info(`Found ${coordinates.length} villages matching farmlist criteria`);

    await createFarmlist(page, '< 100 pop', 1, coordinates);

    await browser.close();
};

main();