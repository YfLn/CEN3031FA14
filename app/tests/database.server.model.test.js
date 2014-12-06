'use strict';

/*
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Database = mongoose.model('Database');

/*
 * Globals
 */

var user, database;

/*
 * Unit tests
 *
 * dl = descriptionLong
 * ds = descriptionShort
 *
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

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Databases / Save Tests -------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
				
		it('should be able to save without problems', function(done) {
				return database.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Single Variable Tests -------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to save without problems when url begins with http://', function(done) {
			database.url = 'http://url.com';

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

		it('should be able to save without error as a free database', function(done) {
			database.isFree = true;

			return database.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to save without error as a paid database', function(done) {
			database.isFree = false;

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

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Double Variable Tests --------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
		it('should be able to show an error if name and descriptionLong are empty', function(done) {
			database.name = '';
			database.descriptionLong = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and descriptionShortare empty', function(done) {
			database.name = '';
			database.descriptionShort = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and url is empty', function(done) {
			database.name = '';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and url is incorrect but does not end in TLD', function(done) {
			database.name = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and url URL does not contain http:// or https://', function(done) {
			database.name = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionLong and descriptionShort is empty', function(done) {
			database.descriptionLong = '';
			database.descriptionShort = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionLong and url is empty', function(done) {
			database.descriptionLong = '';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionLong and url does not contain http:// or https://', function(done) {
			database.descriptionLong = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error if descriptionLong and url does not end in TLD', function(done) {
			database.descriptionLong = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionShort and url is empty', function(done) {
			database.descriptionShort = '';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionShort and url does not contain http:// or https://', function(done) {
			database.descriptionShort = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descriptionShort and url does not end in TLD', function(done) {
			database.descriptionShort = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if url is empty or url does not contain http:// or http://', function(done) {
			database.url = 'url.com';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if does not end in TLD or url does not contain http:// or http://', function(done) {
			database.url = 'url.com';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if url is empty or does not end in TLD', function(done) {
			database.url = 'http://incompleteURL';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Triple Variable Tests --------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to show an error if name, descriptionLong, descirpitonShort are empty', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name, descriptionLong, and URL are empty', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and descriptionLong are empty and should show an error when the URL does not contain http:// or https://', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if name and descriptionLong are empty and should show an error when the URL does not contain ending TLD', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descritionLong, descriptionShort, and url are empty', function(done) {
			database.descriptionLong = '';
			database.descriptionShort = '';
			database.url = '';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descritionLong and descriptionShort are empty and when the URL does not contain http:// or https://', function(done) {
			database.descriptionLong = '';
			database.descriptionShort = '';
			database.url = 'url.com';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descritionLong and descriptionShort are empty and when the URL does not contain ending TLD', function(done) {
			database.descriptionLong = '';
			database.descriptionShort = '';
			database.url = 'http://incompleteURL';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error if descritionLong and url are empty and when the URL does not contain http:// or https://', function(done) {
			database.descriptionShort = '';
			database.url = '';
			database.url = 'url.com';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if descritionLong and url are empty and when the URL does not contain ending TLD', function(done) {
			database.descriptionShort = '';
			database.url = '';
			database.url = 'http://incompleteURL';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error url is empty, when the URL does not contain ending TLD, and when the URL does not contain ending TLD', function(done) {
			database.url = '';
			database.url = 'url.com';
			database.url = 'http://incompleteURL';
			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});
// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ Quad Test -----------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
		
it('should be able to show an error if name, descriptionLong, descirpitonShort are empty and save without url', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if name, descriptionLong, descirpitonShort are empty and url does not contain http:// or https://', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if name, descriptionLong, descirpitonShort are empty and when the URL does not contain ending TLD', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if  descriptionLong, descirpitonShort, and url are empty and url does not contain http://', function(done) {
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';
			database.url = 'url.com';


			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if  descriptionLong, descirpitonShort, and url are empty and URL does not contain ending TLD', function(done) {
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});


it('should be able to show an error if  descirpitonShort and url are empty, URL does not contain ending TLD and url does not contain htt[://', function(done) {
			database.url = 'url.com';
			database.descriptionShort='';
			database.url = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});






// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ Final Tests -----------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------
it('should be able to show an error if name, descriptionLong, descirpitonShort are empty and save without url and without http', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if name, descriptionLong, descirpitonShort are empty and save without url and does not contain TLD', function(done) {
			database.name = '';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';
			database.url = 'http://incompleteURL';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});

it('should be able to show an error if descriptionLong, descirpitonShort, and url are empty and does not contain TLD or http', function(done) {
			database.url = 'http://incompleteURL';
			database.descriptionLong = '';
			database.descriptionShort='';
			database.url = '';
			database.url = 'url.com';

			return database.save(function(err) {
				should.exist(err);
				done();
			});
		});






// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ End of Tests -----------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------





		});

	afterEach(function(done) { 
		Database.remove().exec();
		User.remove().exec();

		done();
	});
});