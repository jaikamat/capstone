var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('../server/db');

var seedMaps = require('./maps');
var seedScrolls = require('./scrolls');
var seedParams = require('./params');
var seedLevels = require('./levels');

connectToDb.then(function (db) {
	return db.db.dropDatabase();
})
.then(function () {
	console.log(chalk.magenta('Database dropped!'));
	return seedMaps();
})
.then(function () {
	console.log(chalk.grey('Maps created!'));
	return seedScrolls();
})
.then(function () {
	console.log(chalk.grey('Scrolls created!'));
	return seedParams();
})
.then(function () {
	console.log(chalk.grey('Params created!'));
	return seedLevels();
})
.then(function () {
	console.log(chalk.grey('Levels created!'));
	console.log(chalk.blue('Seed Successful'));
	process.kill(0);
}).catch(function (err) {
	console.error(err);
	process.kill(1);
})