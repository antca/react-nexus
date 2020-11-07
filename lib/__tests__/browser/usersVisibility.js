import React from 'react';
import ReactDOMServer from 'react-dom/server';
import should from 'should/as-function';

import startServersAndBrowse from '../fixtures/startServersAndBrowse';

const TIME_OUT = 250;

const { after, before, describe, it, browser } = global;
describe('[FT] Users Visibility', () => {

  let cleanup = null;
  let page = null;

  before(async function $before() {
    [page, cleanup] = await startServersAndBrowse();
  });

  after(async function $after() {
    return await cleanup();
  });

  it('should dispatch UsersVisibility action and check if the users list has been hidden', async () => {
    should(await page.$$('.User')).have.length(2);
    await page.click('#UsersVisibility');
    await page.waitForTimeout(TIME_OUT);
    should(await page.$$('.User')).have.length(0);
  });
});
