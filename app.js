'use strict';

require('colors');

var http       = require('http');
var fs         = require('fs');
var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');

var app        = express();
var server     = http.createServer(app);

app.set('port', 1337);

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));

// CORS handlers (for cross-domain API calls)
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Routing
app.use(require('./routes.js'));

// Launching server
server.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port'.green, app.get('port').toString().cyan);
});
