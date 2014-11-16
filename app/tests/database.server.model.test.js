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
			password: 'password',
			portfolio: ['525a8422f6d0f87f0e407a33']
		});

		user.save(function() { 
			database = new Database({
				name: 'Database Name',
				isFree: true,
				descriptionLong: 'a database we created for a test',
				descriptionShort: 'a short description',
				url: 'http://url.com',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems when url begins with http://', function(done) {
			return database.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save without problems when url begins with https://', function(done) {
			database.url = 'https://url.com';

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

		it('should be able to show an error when try to save without descriptionLong', function(done) { 
			database.descriptionLong = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without descriptionShort', function(done) { 
			database.descriptionShort = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without URL', function(done) { 
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when the URL does not contain http:// or https://', function(done) {
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show an error when the URL does not contain ending TLD', function(done) {
			database.url = 'http://incompleteURL';

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