'use strict';

(function() {
	// Settings controller Spec
	describe('SettingsController', function() {
		// Initialize global variables
		var SettingsController,
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
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _$timeout_,_Authentication_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;
			$timeout = _$timeout_;
			Authentication = _Authentication_; //Manually import Authentication service because signin() method is not in this scope.

			// Initialize the Settings controller
			SettingsController = $controller('SettingsController', {
				$scope: scope
			});
		}));


		it('$scope.redirectToViewProfile(1000) should go back to view profile page after 1 second', function(){
			$location.path('/settings/edit'); //Go to edit profile page

			scope.redirectToViewProfile(1000); 
			$timeout(function(){
				expect($location.url()).toEqual('/settings/profile');
			}, 1000);
			
		});

		it('$scope.cancelChanges() should revert the changes to user model', function(){
			Authentication.user = 'Fred'; 

			//Go to edit profile page
			$location.path('/settings/edit'); 

			scope.originalUser = 'Joe';
			scope.cancelChanges();

			expect(Authentication.user).toEqual('Joe');
		});
	});
}());
