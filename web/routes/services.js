"use strict";

var express = require('express'),
    {services} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/list_services', services.web.list_services);

