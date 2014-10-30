'use strict';

/*
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/*
 * Database Schema
 */
var DatabaseSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Database name',
		trim: true
	},
	isFree: {
		type: Boolean,
		default: false
	},
	descriptionLong: {
		type: String,
		default: '',
		required: 'Please provide a description of the dddDatabase',
		trim: true
	},
	descriptionShort: {
		type: String,
		default: '',
		required: 'Please provide a description of the Database',
		trim: true
	},
	url: {
		type: String,
		default: '',
		required: 'Please provide the URL of the Database',
		trim: true,
		match: [/^https?:\/\/?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please enter a valid URL. URL must begin with \'http://\' or \'https://\' and end with a TLD (e.g. \'.com\', \'.net\').']
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Database', DatabaseSchema);