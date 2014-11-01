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
		trim: true
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