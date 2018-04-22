"use strict";

var express = require('express'),
    {userquery} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/list_queries', userquery.web.list_queries);
router.get('/userquery/edit_faq/:faq_id', userquery.web.edit_faq);
router.get('/userquery/delete/:faq_id', userquery.web.delete_faq);
router.post('/userquery/reply', userquery.web.reply);
