"use strict";

var _ = require('lodash');

// default config values
var config = {};

// development config overrides defaults always
config = _.assign(config, require('./development.js'));

// if we're in production mode, production config overrides all defaults
if (process.env.NODE_ENV && process.env.NODE_ENV == 'production'){
  config = _.assign(config, require('./production.js'));
}

  module.exports = config;
