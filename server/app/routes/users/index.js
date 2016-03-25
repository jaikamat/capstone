'use strict';
var router = require('express').Router();
module.exports = router;

var mongoose = require('mongoose');
var User = mongoose.model('User');

//add user
