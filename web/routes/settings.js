"use strict";

var express = require('express'),
    {settings} = require('../controllers'),
    router = module.exports = express.Router();

//router.post('/notification_settings', settings.web.notification_settings);
router.get('/notification_settings', settings.web.notification_settings);