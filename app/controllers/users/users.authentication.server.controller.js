'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Database = mongoose.model('Database'),
	async = require('async'),
	config = require('../../../config/config'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto');

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;
	var smtpTransport = nodemailer.createTransport({
		service: 'Yahoo',
		auth: {
			user: 'ufdatabasestest@yahoo.com',
			pass: 'Aighb123'
		}
	});

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

/*

	if(!req.user){
		var token = crypto.randomBytes(20, function(err, buffer) {
							var token = buffer.toString('hex');
							console.log('token');
							console.log(token);
							return token;
						});
		console.log('token2');
		console.log(token);
		user.verified = token;
		console.log('USER TOKEN :::');
		console.log(user.verified);
	} else {
		user.verified = '';
	}

*/

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			if(!req.user){
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		}
	});

	if(!req.user){
		async.waterfall([
			// Generate random token
			function(done) {
				crypto.randomBytes(20, function(err, buffer) {
					var token = buffer.toString('hex');
					done(err, token);
				});
			},
			//Generate Email to be sent.
			function(token, done) {
				res.render('templates/users-signup-verification-email', { 
					name: user.firstName + user.lastName,
					appName: config.app.title,
					url : 'http://' + req.headers.host + '/auth/verify/' + token
				}, function(err, emailHTML) {
					done(err, emailHTML, user);
				});

				user.verified = token;
				console.log('USER TOKEN :::');
				console.log(user.verified);
			},
			//Send email
			function(emailHTML, user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: 'Yahoo',
					auth: {
						user: 'ufdatabasestest@yahoo.com', // temp email, need to talk w/ joost
						pass: 'Aighb123'
					}
				});
				var mailOptions = {
					to: user.username, // reciever
					from: 'UF Database Collaboration Project <ufdatabasestest@yahoo.com>', // sender
					subject: 'Account Email Verification',
					html: emailHTML
				};
				
				smtpTransport.sendMail(mailOptions, function(err) {
					done(err, 'done');
				});

			}
		],function (err, result) {
	   		// result now equals 'done'
		});
	} else {
		user.verified = '';
	}

};

//var lookupPortfolios = function(user, callback){
	
	//var findFunctions = [];
	//for(var i = 0; i < user.portfolios.length; i++)
	//{
		//findFunctions.push(function(callback){
			//Database.findOne({_id: user.portfolios[i]}).exec(callback);
		//});	
	//}
	//async.parallel(findFunctions, function(err, results){
		//if(err !== null)
			//return callback(err);
		//user.portfolios = results;
		//callback(null, user);
	//});
//};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			// Look up for portfolio
			//lookupPortfolios(user, function(err, user){
				//if(err !== null){
					//res.status(500).send(err);
				//}
				//else{

					req.login(user, function(err) {
						if (err) {
							res.status(400).send(err);
						} else {							
							res.jsonp(user);			
							//console.log(user);
						}
					//});
				//}
			});
		}
	})(req, res, next);
};

exports.validateVerificationToken = function(req, res) {
	User.findOne({
		verified: req.params.token
	}, function(err, user) {
		if (!user) {
			console.log('error verifying');
			return res.redirect('/#!/auth/verify/' + req.params.token);
		}
		console.log('redirect correct');
		res.redirect('/#!/auth/verify/' + req.params.token);
	});
};

exports.verifyEmail = function(req, res) {
 	async.waterfall([
 		function(done) {
			User.findOne({
				verified: req.params.token
			}, function(err, user) {
				if (!err && user) {
						user.verified = '';
						console.log('email');
						console.log(user.username);
						console.log('verified');
						console.log(user.verified);

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: errorHandler.getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										// Return Verified user 
										res.jsonp(user);
										done(err, user);
									}
								});
							}
						});
				} else {
					return res.status(400).send({
						message: 'Email Validation token is invalid.'
					});
				}
			});
		},

	],function (err, result) {
   		// result now equals 'done'
	}); // End of async.waterfall
};



/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							// email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};