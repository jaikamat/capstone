'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	scrollId: Number,

	data: [{
		type: String,
		conn: {
			next: ,
			truePath ,
			falsePath ,
		}
	}]
})