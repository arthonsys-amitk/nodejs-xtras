"use strict";

var express = require('express'),
    {user} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/',user.web.all_user);
router.get('/delete/:user_id',user.web.delete);
router.get('/edit/:user_id',user.web.edit);
router.post('/update_profile',user.web.update_profile);