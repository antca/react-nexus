import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import startServersAndBrowse from '../fixtures/startServersAndBrowse';

const TIME_OUT = 250;

const { after, before, describe, it, browser } = global;
describe('[FT] Delete User', () => {
  let cleanup = null;
  let page = null;

  before(async function $before() {
    [page, cleanup] = await startServersAndBrowse();
  });

  after(async function $after() {
    return await cleanup();
  });

  it('should dispatch deleteUser action and check if a user has been deleted', async () => {
    should(await page.$$('.User')).have.length(2);
    await page.click('.Users li:last-child > div > button');
    await page.waitForTimeout(TIME_OUT);
    should(await page.$$('.User')).have.length(1);
  });
});
