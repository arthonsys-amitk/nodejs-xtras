"use strict";

var express = require('express'),
    web = require('../controllers').product.web,
    router = module.exports = express.Router();


router.post('/', web.createProduct);
router.get('/:productID', web.getProduct);
router.post('/search', web.search);
router.put('/', web.updateProduct);
router.delete('/', web.deleteProduct);
router.get('/currentversion/:prod', web.getCurrentVersion)
