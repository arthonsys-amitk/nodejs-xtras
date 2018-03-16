"use strict";

var express = require('express'),
    web = require('../controllers').contact.web,
	contactapi = require('../controllers').contact,
	router = module.exports = express.Router();
/*
router.post('/', web.createUser);
router.get('/:userID', web.getUser);
router.post('/search', web.search);
router.put('/', web.updateUser);
router.delete('/', web.deleteUser);
router.put('/updatePassword', web.updatePassword);
router.put('/updateForgotPassword', web.updateForgotPassword);
router.post('/passwordReset', web.generatePasswordReset);
*/
//router.post('/postContact', contactapi.postContact);
router.post('/postContact', web.webpostContact);
