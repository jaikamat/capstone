/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Maps = Promise.promisifyAll(mongoose.model('Maps'));
var Scrolls = Promise.promisifyAll(mongoose.model('Scrolls'));
var Params = Promise.promisifyAll(mongoose.model('Params'));

var mapData = require('./seedData/rawData/maps.json');

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    return User.createAsync(users);

};

connectToDb.then(function (db) {
  return db.db.dropDatabase();
}).then(function() {
  return seedUsers();
}).then(function () {
    console.log(chalk.green('Seed successful!'));
    process.kill(0);
}).catch(function (err) {
  console.error(err);
  process.kill(1);
});
