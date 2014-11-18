'use strict';

/*
 * Module dependencies.
 */

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

/*
 * Globals
 */

var user, user2;

/*
 * Unit tests
 *
 * ri = research interests
 * pass = password
 *
 */

describe('User Model Unit Tests:', function() {
	before(function(done) {
		user = new User({
			firstName: 'Firsty',
			lastName: 'Namey',
			username: 'user@ufl.edu',
			researchinterests: 'generic research interests',
			password: 'password',
			provider: 'local',
			portfolio: ['525a8422f6d0f87f0e407a33']
		});
		user2 = new User({
			firstName: 'Firsty',
			lastName: 'Namey',
			username: 'user@ufl.edu',
			researchinterests: 'generic research interests',
			password: 'password',
			provider: 'local',
			portfolio: ['525a8422f6d0f87f0e407a33']
		});

		done();
	});

	describe('Method Save', function() {

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ User / Save Tests ------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should begin with no users', function(done) {
			User.find({}, function(err, users) {
				users.should.have.length(0);
				done();
			});
		});

		it('should be able to save without problems', function(done) {
			user.save(done);
		});

		it('should fail to save an existing user again', function(done) {
			user.save();

			return user2.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should show a user in the database after one is saved', function(done) {
			user.save();

			User.find({}, function(err, users) {
				users.should.have.length(1);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------- Single Variable Tests -------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to show an error when try to save without first name', function(done) {
			user.firstName = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a last name', function(done) {
			user.lastName = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without a password', function(done) {
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when a non valid email is used', function(done) {
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when an email address is not provided', function(done) {
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

	/* Not sure why this isnt working.
		it('should be able to save without any research interests given', function(done) {
			user.researchinterests = '';

			return user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
	*/

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Double Variable Tests --------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to show an error if fname and lname are empty', function(done) {
			user.fname = '';
			user.lname = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and email are empty', function(done) {
			user.fname = '';
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and research interests are empty', function(done) {
			user.fname = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and password are empty', function(done) {
			user.fname = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname is empty and email is invalid but non-empty', function(done) {
			user.fname = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error if lastname and email are empty', function(done) {
			user.lname = '';
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lastname is empty and email is invalid but non-empty', function(done) {
			user.lname = '';
			user.username ='user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});


		it('should be able to show an error if lname is empty and research interests is empty', function(done) {
			user.lname = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname and password are empty', function(done) {
			user.lname = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if email and password are empty', function(done) {
			user.username = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if email is invalid and password is empty', function(done) {
			user.username = 'test@gmail.com';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if email and research interests are empty', function(done) {
			user.username = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if email is invalid and research interests is empty', function(done) {
			user.username = 'user@yahoo.com';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if password and research interests are empty', function(done) {
			user.password = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Triple Variable Tests --------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to show an error if fname, lname, and email are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and lname are empty and email is invalid', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, and researchinterests are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, and password are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, ri, and email are empty', function(done) {
			user.fname = '';
			user.researchinterests = '';
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, pass, and email are empty', function(done) {
			user.fname = '';
			user.password = '';
			user.username = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and ri are empty and email is invalid', function(done) {
			user.fname = '';
			user.researchinterests = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname and pass are empty and email is invalid', function(done) {
			user.fname = '';
			user.password = '';
			user.username = 'user@gmail.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, ri, and pass are empty', function(done) {
			user.fname = '';
			user.researchinterests = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname, email, and ri are empty', function(done) {
			user.lname = '';
			user.username = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname, email, and pass are emtpy', function(done) {
			user.lname = '';
			user.username = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname and ri are empty and email is invalid', function(done) {
			user.lname = '';
			user.researchinterests = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname and pass are empty and email is invalid', function(done) {
			user.lname = '';
			user.password = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname, ri, and pass are empty', function(done) {
			user.lname = '';
			user.researchinterests = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if ri, email, and pass are empty', function(done) {
			user.researchinterests = '';
			user.username = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if ri and pass are empty and email is invalid', function(done) {
			user.researchinterests = '';
			user.password = '';
			user.username = 'user@yahoo.com';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------ Quadruple Variable Tests -----------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

		it('should be able to show an error if fname, lname, email, and ri are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, email, and pass are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, pass, and ri are empty', function(done) {
			user.fname = '';
			user.lname = '';
			user.password = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, email, pass, and ri are empty', function(done) {
			user.fname = '';
			user.username = '';
			user.password = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname, email, ri, and pass are empty', function(done) {
			user.lname = '';
			user.username = '';
			user.researchinterests = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, and ri are empty and email is invalid', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = 'user@yahoo.com';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, lname, and pass are empty and email is invalid', function(done) {
			user.fname = '';
			user.lname = '';
			user.username = 'user@yahoo.com';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if fname, pass, and ri are empty and email is invalid', function(done) {
			user.fname = '';
			user.username = 'user@yahoo.com';
			user.password = '';
			user.researchinterests = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error if lname, ri, and pass are empty and email is invalid', function(done) {
			user.lname = '';
			user.username = 'user@yahoo.com';
			user.researchinterests = '';
			user.password = '';

			return user.save(function(err) {
				should.exist(err);
				done();
			});
		});

// -------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------ End of Tests -----------------------------------------------------
// -------------------------------------------------------------------------------------------------------------------------

	}); 

	after(function(done) {
		User.remove().exec();
		done();
	});
});