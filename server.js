"use strict";

var express = require('express'),
    config = require('./config'),
    app = express(),
    path = require('path'),
    port = process.env.PORT || config.expressPort,
    bodyParser = require('body-parser'),
    multer = require('multer'),
    routes = require('./api/routes'),
    router = express.Router(),
    middleware = require('./middleware'),
    cron = require('node-cron');

app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.all('/*', (req, res, next)=>{
  // CORS header support
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// routes handaling module wise
app.use('/api', routes.user);
app.use('/api', routes.content);
// secure API endpoints
/* NOTE - moved into the routes files
if (config.secureAPI){
  app.all('/API/*', [middleware.validateRequest]);
}
*/

app.use('/API/user', routes.user);


// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.status(404).sendFile(path.join(__dirname + '/404.html'));
});

var server = app.listen(port, function(){
  var portInUse = server.address().port;
  console.log('Xtras server listening on port %s', portInUse);
});

module.exports = server;
