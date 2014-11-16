'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Database = mongoose.model('Database'),
 	User = mongoose.model('User'),
 	httpMocks = require('node-mocks-http'),
 	Handlebars = require('handlebars'),
	phantom = require('phantom'),
	fs = require('fs'),
	controller = require('../../controllers/databases'),
	util = require('util');
/**
 * Globals, id later becomes the mongodb id of a document so that it can
 * be used in id specific routes.
 */
var user, database, req, req2, res, res2, res3;

/**
 * Functional tests.
 * I wrote tests that should pass. The remaining tests that need to be written are those
 * that should throw an error. Like passing in a garbage id causes an error to be thrown.
 * Or passing in a garbage course causes an error. Stuff like that. Will be similar in the controller.
 */

 /**
  * File adjusted to conform to courseCommitteEvaluationForm
  */

describe('Database Contoller Unit Tests:', function() {

	beforeEach(function(done) {
		user = new User({
			firstName: 'Firsty',
			lastName: 'Namey',
			username: 'user@ufl.edu',
			researchinterests: 'generic research interests',
			password: 'password',
			provider: 'local',
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

			// console.log('util.inspect: '+util.inspect(courseEvaluation));

			req = httpMocks.createRequest({
				method: 'POST',
				url: '/database',
				body: database
			});

			res  = httpMocks.createResponse();
			res2 = httpMocks.createResponse();
			res3 = httpMocks.createResponse();

			done();
			
		});

	});


	describe('Database create Tests', function() {


		it('should create a new Database', function(done) {
			controller.create(req,res, function() {

				var code = JSON.parse(res._getStatusCode());
				var data = JSON.parse(res._getData());
				data.isFree.should.equal(database.isFree);

				User.findById(database.user).exec(function(err, course) {
					data.name.should.equal(database.name);
					code.should.equal(200);
					done();
				});
			});
		});

		it('should fail to create a database without name.', function(done) {
			database.name = '';
		 	req.body = database;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
    	});

    	it('should fail to create a database without descriptionLong.', function(done) {
			database.descriptionLong = '';
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
    	});

   		it('should fail to create a database without descriptionShort', function(done) {
			database.descriptionShort = '';
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
    	});

    	it('should fail to create a database without url.', function(done) {
			database.url = '';
		 	req.body = courseEvaluation;
		 	controller.create(req,res, function() {
		 		var code = JSON.parse(res._getStatusCode());
		 		code.should.equal(400);
		 		done();
		 	});
    	});
	});	

	afterEach(function(done) {
		CourseCommittee.remove().exec();
		CourseModel.remove().exec();
		done();
	});