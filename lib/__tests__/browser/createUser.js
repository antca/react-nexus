import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import startServersAndBrowse from '../fixtures/startServersAndBrowse';

const TIME_OUT = 250;

const { after, before, describe, it } = global;
describe('[FT] Create User', function () {

  let cleanup = null;
  let page = null;

  before(async function $before() {
    [page, cleanup] = await startServersAndBrowse();
  });

  after(async function $after() {
    return await cleanup();
  });

  it('should dispatch createUser action and check if a new user has been added', async () => {
    await page.type('#InputUserName', 'Nicolas');
    await page.type('#InputUserRank', 'Diamond');
    await page.click('#CreateUser');
    await page.waitForTimeout(TIME_OUT);

    const userNames = await page.$$eval('.UserName', (nodes) => {
      return nodes.map((node) => node.textContent);
    });

    const userRanks = await page.$$eval('.UserRank', (nodes) => {
      return nodes.map((node) => node.textContent);
    });

    should(userNames[2]).be.equal('User Name: Nicolas');
    should(userRanks[2]).be.equal('User Rank: Diamond');
  });
});
