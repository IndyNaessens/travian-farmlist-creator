import { startBrowserAndOpenPage } from './browser';
import { findCoordinatesForInactivePlayers } from './interactions/getter-tools/getter-tools';

const main = async () => {
    const [browser, page] = await startBrowserAndOpenPage();
    const coordinates = await findCoordinatesForInactivePlayers(page);

    await browser.close();
};

main();