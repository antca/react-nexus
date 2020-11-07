import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import startServersAndBrowse from '../fixtures/startServersAndBrowse';

const TIME_OUT = 250;

const { after, before, describe, it, browser } = global;
describe('[FT] Update User', () => {

  let cleanup = null;
  let page = null;

  before(async function $before() {
    [page, cleanup] = await startServersAndBrowse();
  });

  after(async function $after() {
    return await cleanup();
  });

  it('should dispatch updateUser action and check if a user has been updated', async () => {
    await page.type('#InputUserName-1', 'Plante');
    await page.type('#InputUserRank-1', 'Challenger');
    await page.click('.Users li:first-child > div > div > button');

    await page.waitForTimeout(TIME_OUT);

    const firstUserNameValue = await page.$eval('.User .UserName', (node) => {
      return node.textContent;
    });

    const firstUserRankValue = await page.$eval('.User .UserRank', (node) => {
      return node.textContent;
    });

    should(firstUserNameValue).be.equal('User Name: Plante');
    should(firstUserRankValue).be.equal('User Rank: Challenger');
  });

});
