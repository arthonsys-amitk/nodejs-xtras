"use strict";

var express = require('express'),
    config = require('./config'),
    app = express(),
    path = require('path'),
    port = process.env.PORT || config.expressPort,
    bodyParser = require('body-parser'),
    multer = require('multer'),
    routes = require('./api/routes'),
    {fixLicenses} = require('./api/controllers/purchase'),
    router = express.Router(),
    middleware = require('./middleware'),
    cron = require('node-cron');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// routes accessible by anyone
app.use('/', routes.auth);
app.use('^.*/user/passwordReset$', routes.user);
app.use('^.*/user/updateForgotPassword$', routes.user);
app.use('^.*/contact/postContact$', routes.contact);

// secure API endpoints
if (config.secureAPI){
  app.all('/API/*', [middleware.validateRequest]);
}

app.use('/API/purchase', routes.purchase);
app.use('/API/user', routes.user);
app.use('/API/product', routes.product);
app.use('/API/contact', routes.contact);

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/
  res.status(404).sendFile(path.join(__dirname + '/404.html'));
});

var server = app.listen(port, function(){
  var portInUse = server.address().port;
  console.log('X-traS Server listening on port %s', portInUse); 
});

//let task = cron.schedule('* 12 * * *', fixLicenses());

module.exports = server;
