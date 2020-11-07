import fs from "fs";
import path from "path";

import _ from "lodash";

// CSS and JS are injected inline.
// This might change in the future.
const tpl = _.template(`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title><%- title %></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" href="apple-touch-icon.png">
  </head>
  <body>
  <div id='__App__'><%= appHtml %></div>
  <script><%= nexusPayload %></script>
  <script><%= httpConfig %></script>
  <script>
   <%= js %>
  </script>
  </body>
</html>
`);

/**
 * Returns the HTML to send to the client
 * @param {Object} data Data to bind to the template
 * @param {String} options.title Title of the page
 * @param {String} options.appHtml Raw HTML to put inside the app div container
 * @param {String} options.nexusPayload Payload exported from preparing the app
 * @return {String} HTML to safely send directly to the client
 */
function template({ title, appHtml, nexusPayload, httpConfig, js }) {
  return tpl({
    js,
    title,
    appHtml,
    nexusPayload:
      // base64 encode to obfuscate URLs and prevent injection
      `window.__NEXUS_PAYLOAD__="${Buffer.from(nexusPayload).toString(
        "base64"
      )}"`,
    httpConfig:
      // base64 encode to obfuscate URLs and prevent injection
      `window.__HTTP_CONFIG__='${Buffer.from(httpConfig).toString("base64")}'`,
  });
}

export default template;
