'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
  var cache = [];
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>REQUEST:</h1>');
  res.write('<pre>'+JSON.stringify(req, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return;
      // Store value in our collection
      cache.push(value);
    }
    return value;
  })+'</pre>');
  cache = null; 
  console.log("Request:");
  console.log(req)
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);
