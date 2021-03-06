'use strict';

require('colors');

var http           = require('http');
var path           = require('path');
var fs             = require('fs');
var express        = require('express');
var methodOverride = require('method-override');
var bodyParser     = require('body-parser');
var morgan         = require('morgan');
var compression    = require('compression');

var app            = express();
var server         = http.createServer(app);

app.set('port', 1337);
app.set('views', path.join(__dirname, 'public')); // Override Jade's default /views/ directory
app.set('view engine', 'jade');

app.use(methodOverride('_method'));
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
app.use(function(req, res, next) {
  res.views = { index: {
    method     : req.method,
    serverRoot : req.protocol + '://' + req.get('host'),
    fullUrl    : req.protocol + '://' + req.get('host') + req.originalUrl
  } };
  next();
});
app.use(compression()); // gzip/deflate
app.use(require('./routes.js'));
app.use(function(req, res) {
  res.render('index', res.views.index);
});

// Launching server
server.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port'.green, app.get('port').toString().cyan);
});
