"use strict";

var express = require('express'),
    {content} = require('../controllers'),
    router = module.exports = express.Router();


router.post('/insert_contact_us', content.api.insert_contact_us);
router.post('/get_privacy_policy', content.api.get_privacy_policy);