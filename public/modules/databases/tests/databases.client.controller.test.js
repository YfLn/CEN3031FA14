'use strict';

(function() {
	// Databases Controller Spec
	describe('Databases Controller Tests', function() {
		// Initialize global variables
		var DatabasesController,
		scope,
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Databases controller.
			DatabasesController = $controller('DatabasesController', {
				$scope: scope
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
				name: 'New Database'
			});

			// Set the URL parameter
			$stateParams.databaseId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/databases\/([0-9a-fA-F]{24})$/).respond(sampleDatabase);

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
	});
}());