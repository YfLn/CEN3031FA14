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

		it('$scope.updateUserProfile() should correctly update the user model', function(){
			//Backend simulate updating user
			$httpBackend.expectPUT('users').respond(200, {name:'Fred', researchinterests:'Food'});

			Authentication.user = [{name:'Joe'}, {researchinterests:'Drills'}]; //Previous value of Authentication.user
			scope.user = [{name:'Fred'},{researchinterests:'Food'}]; //The newly defined user

			scope.updateUserProfile(true); //Try to update user profile with the values in scope
			$httpBackend.flush();

			//Expect the values of Authentication.user to be changed to scope.user
			expect(Authentication.user.name).toEqual('Fred');
			expect(Authentication.user.researchinterests).toEqual('Food');
		});

		it('$scope.changeUserPassword() should clear the form when the password is successfully change', function(){
			$httpBackend.expect('POST', '/users/password').respond(200, 'Password Changed Successfully');

			scope.changeUserPassword();
			$httpBackend.flush();

			expect(scope.success).toEqual(true);
			expect(scope.passwordDetails).toEqual(null);
		});
	});
}());
