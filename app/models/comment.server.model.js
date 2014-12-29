'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	reviews: {
		type: String,
		default: '',
		trim: true,
		required: 'Please enter text'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	gistId: {
		type: String,
		default: '',
	},
	databaseId: {
		type:String
	}
});

mongoose.model('Comment', CommentSchema);