"use strict";

var express = require('express'),
    config = require('./config'),
    app = express(),
    path = require('path'),
    port = process.env.PORT || config.expressPort,
    bodyParser = require('body-parser'),
    multer = require('multer'),
    routes = require('./api/routes'),
    web_routes = require('./web/routes'),
    router = express.Router(),
	session = require('express-session'),
    fileUpload = require('express-fileupload'),
    middleware = require('./middleware'),
	flash = require("connect-flash"),
    cron = require('node-cron');

	app.use(bodyParser.json({limit: '500mb'}));
	app.use(bodyParser.urlencoded({ extended: true, limit: '500mb', parameterLimit:50000 }));

	app.use(session({
			  secret: 'LJ*^*&KJHKJ)*(*)*',
			  resave: false,
			  saveUninitialized: true,
			  cookie: { maxAge: 5*60*1000 }
			}));

app.use(express.static('public'));
app.use(express.static('assets'));
app.use(flash());
app.use(fileUpload());

app.all('/*', (req, res, next)=>{
  // CORS header support
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
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

// set default template engine
app.set('view engine', 'ejs');

// routes handaling module wise
app.use('/api', routes.user);
app.use('/api', routes.content);
app.use('/api', routes.services);
app.use('/api', routes.search);

// routing for Web Admin Panel
app.use('/admin', web_routes.login);
app.use('/admin/user', web_routes.user);
app.use('/admin/coupon', web_routes.coupon);


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
