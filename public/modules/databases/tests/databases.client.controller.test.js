'use strict';

(function() {
	// Databases Controller Spec
	describe('Databases Controller Tests', function() {
		// Initialize global variables
		var DatabasesController,
		scope,
		Authentication,
		Auth,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
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

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			Auth = _Authentication_;

			// Initialize the Databases controller.
			DatabasesController = $controller('DatabasesController', {
				$scope: scope,
				Authentication: Auth
			});
		}));

		it('$scope.find() should create an array with at least one Database object fetched from XHR', inject(function(Databases) {
			// Create sample Database using the Databases service
			var sampleDatabase = new Databases({
				name: 'New Database'
			});

			// Create a sample Databases array that includes the new Database
			var sampleDatabases = [sampleDatabase];

			// Set GET response
			$httpBackend.expectGET('databases').respond(sampleDatabases);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.databases).toEqualData(sampleDatabases);
		}));

		it('$scope.findOne() should create an array with one Database object fetched from XHR using a databaseId URL parameter', inject(function(Databases) {
			// Define a sample Database object
			var sampleDatabase = new Databases({
				name: 'New Database',
				id: 'id'
			});

			// Define a sample portfolio
			var samplePortfolio = ['id', 'di', '525a8422f6d0f87f0e407a33'];

			// Define a sample user
			var sampleUser = {firstName: 'Joe', portfolios: samplePortfolio};

			// Set the URL parameter
			$stateParams.databaseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/databases\/([0-9a-fA-F]{24})$/).respond(200, sampleDatabase);
			//GET Response for when $scope.findDBUsers is called
			$httpBackend.expectGET('users').respond(200, [sampleUser]);
			$httpBackend.expectGET('comments').respond(200, ['You suck!']);
			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.database).toEqualData(sampleDatabase);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Databases) {
			// Create a sample Database object
			var sampleDatabasePostData = new Databases({
				name: 'New Database'
			});

			// Create a sample Database response
			var sampleDatabaseResponse = new Databases({
				_id: '525cf20451979dea2c000001',
				name: 'New Database'
			});

			// Fixture mock form input values
			scope.name = 'New Database';

			// Set POST response
			$httpBackend.expectPOST('databases', sampleDatabasePostData).respond(sampleDatabaseResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Database was created
			expect($location.path()).toBe('/databases/' + sampleDatabaseResponse._id);
		}));

		it('$scope.update() should update a valid Database', inject(function(Databases) {
			// Define a sample Database put data
			var sampleDatabasePutData = new Databases({
				_id: '525cf20451979dea2c000001',
				name: 'New Database'
			});

			// Mock Database in scope
			scope.database = sampleDatabasePutData;

			// Set PUT response
			$httpBackend.expectPUT(/databases\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/databases/' + sampleDatabasePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid databaseId and remove the Database from the scope', inject(function(Databases) {
			// Create new Database object
			var sampleDatabase = new Databases({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Databases array and include the Database
			scope.databases = [sampleDatabase];
			
			// Set expected DELETE response
			$httpBackend.expectDELETE(/databases\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDatabase);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.databases.length).toBe(0);
		}));

		it('$scope.addDatabaseToPortfolio() should correctly add database to Authentication.user', function(){
			$httpBackend.expectPUT('users').respond(200, 
					{name:'Fred', researchinterests:'Food', portfolios:['0','1']});

			Auth.user = {name:'Fred', researchinterests:'Food', portfolios:['0']};
			scope.database = {_id: '1'};

			scope.addDatabaseToPortfolio();
			$httpBackend.flush();

			expect(Auth.user.portfolios).toEqual(['0','1']);
		});

		it('$scope.removeDatabaseFromPortfolio() should correctly remove database from Authentication.user', function(){
			$httpBackend.expectPUT('users').respond(200, 
					{name:'Fred', researchinterests:'Food', portfolios:['0']});

			Auth.user = {name:'Fred', researchinterests:'Food', portfolios:['0','1']};
			scope.database = {_id: '1'};

			scope.removeDatabaseFromPortfolio();
			$httpBackend.flush();

			expect(Auth.user.portfolios).toEqual(['0']);
		});

		it('$scope.findDBUsers should only find those users who have the DB in their portfolio', function(){
			//Define initial variables
			var s_User1 = {firstName: 'Joe', portfolios: ['3aA', '4bB']};
			var s_User2 = {firstName: 'Fred', portfolios: ['5cC', '6dD']};

			//Mock backend
			$httpBackend.expectGET('users').respond(200, [s_User1, s_User2]);
		
			scope.findDBUsers('5cC');
			$httpBackend.flush();

			expect(scope.dbUsers[0].firstName).toEqual('Fred');

			//Mock backend
			$httpBackend.expectGET('users').respond(200, [s_User1, s_User2]);

			scope.findDBUsers('3aA');
			$httpBackend.flush();

			expect(scope.dbUsers[0].firstName).toEqual('Joe');
		});
	});
}());