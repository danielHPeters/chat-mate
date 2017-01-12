/* jshint node:true, esversion:6 */

/**
 * Routes
 */

'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'ChatMate' });
});

module.exports = router;
