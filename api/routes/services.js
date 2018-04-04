"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    {user} = require('../controllers'),
    {services} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/post_service', services.api.post_service);
