"use strict";

var express = require('express'),
    {login} = require('../controllers'),
    router = module.exports = express.Router();

router.get('/', login.web.login);
router.get('/profile', login.web.profile);
router.get('/change_password', login.web.change_password);
router.post('/update_password', login.web.update_password);
router.post('/update_profile', login.web.update_profile);
router.get('/dashboard', login.web.dashboard);
router.post('/login/login_process', login.web.login_process);
router.get('/logout', login.web.logout);