import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import createFlux from './createFlux';
const { port } = JSON.parse(atob(window.__HTTP_CONFIG__));
const reflux = createFlux({ port }).loadState(
  JSON.parse(atob(window.__NEXUS_PAYLOAD__))
);
ReactDOM.render(<App flux={reflux} />, document.getElementById('__App__'));
