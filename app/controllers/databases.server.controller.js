'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Database = mongoose.model('Database'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Database
 */
exports.create = function(req, res) {
	var database = new Database(req.body);
	database.user = req.user;

	database.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(database);
		}
	});
};

/**
 * Show the current Database
 */
exports.read = function(req, res) {
	res.jsonp(req.database);
};

/**
 * Update a Database
 */
exports.update = function(req, res) {
	var database = req.database ;

	database = _.extend(database , req.body);

	database.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(database);
		}
	});
};

/**
 * Delete an Database
 */
exports.delete = function(req, res) {
	var database = req.database ;

	database.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(database);
		}
	});
};

/**
 * List of Databases
 */
exports.list = function(req, res) { Database.find().sort('-created').populate('user', 'displayName').exec(function(err, databases) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(databases);
		}
	});
};

/**
 * Database middleware
 */
exports.databaseByID = function(req, res, next, id) { Database.findById(id).populate('user', 'displayName').exec(function(err, database) {
		if (err) return next(err);
		if (! database) return next(new Error('Failed to load Database ' + id));
		req.database = database ;
		next();
	});
};

/**
 * Database authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if(req.user.roles.indexOf('admin') === -1) {
		if (req.database.user.id !== req.user.id) {
			return res.status(403).send('User is not authorized');
		}
	}
	next();
};