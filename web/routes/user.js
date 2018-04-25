"use strict";

var express = require('express'),
    {user} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/',user.web.all_user);
router.get('/delete/:user_id',user.web.delete);
router.get('/edit/:user_id',user.web.edit);
router.post('/update_profile',user.web.update_profile);
router.get('/create_user',user.web.create_user);
router.post('/add_user',user.web.add_user);
router.post('/update_admin_password',user.web.update_admin_password);
router.post('/update_password',user.web.update_password);