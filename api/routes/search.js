"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    {user} = require('../controllers'),
    {search} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/search_services', search.api.search_services);


