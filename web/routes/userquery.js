"use strict";

var express = require('express'),
    {userquery} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/list_queries', userquery.web.list_queries);

