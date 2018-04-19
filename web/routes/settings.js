"use strict";

var express = require('express'),
    {settings} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/notification_settings', settings.web.notification_settings);
router.post('/notification_update', settings.web.notification_update);
