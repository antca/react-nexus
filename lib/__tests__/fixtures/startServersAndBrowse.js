import puppeteer from "puppeteer";
import ApiServer from "./ApiServer";
import RenderServer from "./RenderServer";

async function startServersAndBrowse() {
  const apiServer = new ApiServer({ port: 0 });
  await apiServer.startListening();
  const { port: apiPort } = apiServer.server.address();

  const renderServer = new RenderServer({ port: 0, apiPort });
  await renderServer.startListening();
  const { port: renderPort } = renderServer.server.address();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${renderPort}`);

  return [
    page,
    () =>
      Promise.all([
        renderServer.stopListening(),
        apiServer.stopListening(),
        browser.close(),
      ]),
  ];
}

export default startServersAndBrowse;
