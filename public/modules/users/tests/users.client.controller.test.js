'use strict';

(function() {
	//Users Controller Spec
	describe('UsersController', function() {
		//initialize global variables
		var UsersController,
			scope,
			Authentication,
			$httpBackend,
			$stateParams,
			$location,
			$timeout;

		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$timeout_,_Authentication_, _$modal_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			$timeout = _$timeout_;
			Authentication = _Authentication_; //Manually import Authentication service because signin() method is not in this scope.

			// Initialize the Settings controller
			UsersController = $controller('UsersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should return an array with at least one User', inject(function(Users) {
			//Create sample User using Users service
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];
			var sampleUser = new Users({
				firstName: 'Sample',
				lastName: 'User',
				portfolios: samplePortfolio,
				username: 'testBoy@ufl.edu'
			});

			var sampleUsers = [sampleUser];

			//Set GET response
			$httpBackend.expectGET('users').respond(sampleUsers);

			scope.find();
			$httpBackend.flush();

			expect(scope.users).toEqualData(sampleUsers);
		}));

		it('$scope.findOne() should create an array with one User fetched from XHR using a userID URL paramter', inject(function(Users) {
			//Define a sample User object
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];
			var sampleUser = new Users({
				firstName: 'Sample',
				lastName: 'User',
				portfolios: samplePortfolio,
				username: 'testBoy@ufl.edu',
				id: 'id'
			});

			//Set GET response
			$httpBackend.expectGET(/users\/([0-9a-fA-F]{24})$/).respond(200, sampleUser);

			//Set the URL parameter
			$stateParams.userId = 'id';

			scope.findOne();
			$httpBackend.flush();

			//Test scope value
			expect(scope.user).toEqualData(sampleUser);
		}));

		it('$scope.findAll() should remove a bad database entry from portfolio', inject(function(Users) {
			//Define a sample portfolio
			var samplePortfolio = ['3aA'];
			//Define a sample User
			var sampleUser = new Users({
				firstName: 'Sample',
				lastName: 'User',
				portfolios: samplePortfolio,
				username: 'testBoy@ufl.edu',
				id: 'id'
			});

			//Set GET response
			$httpBackend.expectGET(/users\/([0-9a-fA-F]{24})$/).respond(200, sampleUser);

			//Set URL parameter
			$stateParams.userId = 'id';

			scope.user = sampleUser;

			//Remove any bad elements
			scope.findAll();
			expect(scope.user.portfolios).toEqual([]);

		}));



		});
}());