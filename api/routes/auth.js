"use strict";

var express = require('express'),
    {auth} = require('../controllers'),
    router = module.exports = express.Router();

router.post('/login', auth.login);
