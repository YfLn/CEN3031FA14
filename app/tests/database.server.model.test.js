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

/**
 * Unit tests
 */
describe('Database Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			username: 'test@ufl.edu',
			password: 'password'
		});

		user.save(function() { 
			database = new Database({
				name: 'Database Name',
				isFree: true,
				description: 'a database we created for a test',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return database.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			database.name = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Database.remove().exec();
		User.remove().exec();

		done();
	});
});