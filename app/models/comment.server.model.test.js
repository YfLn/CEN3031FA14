'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Database = mongoose.model('Database');


/**
 * Globals
 */
var user, database;

describe('Comment server model test:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			username: 'test@ufl.edu',
			password: 'password'
		});

			user.save(function() { 
			comment = new Comment({
				isFree: true,
				reviews: 'a short review',
				
				user: user
			});

			done();
		});
	})
	

	describe('Method Save', function() {
		it('should be able to save without problems when url begins with http://', function(done) {
			return comment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});



	it('should be able to show an error when try to save without reviews', function(done) { 
			comment.reviews = '';

			return comment.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});



	afterEach(function(done) { 
		Comment.remove().exec();
		User.remove().exec();

		done();
	});
});