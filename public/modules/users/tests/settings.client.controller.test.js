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
			$modal,
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
			$modal = _$modal_;
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

			//Go to edit profile page
			$location.path('/settings/edit'); 

			scope.originalUser = 'Joe';
			scope.cancelChanges();

			expect(Authentication.user).toEqual('Joe');
		});

		it('$scope.updateUserProfile() should correctly update the user model', function(){
			//Backend simulate updating user
			$httpBackend.expectPUT('users').respond(200, {name:'Fred', researchinterests:'Food'});

			scope.user = [{name:'Fred'},{researchinterests:'Food'}]; //The newly defined user

			scope.updateUserProfile(true); //Try to update user profile with the values in scope
			$httpBackend.flush();

			//Expect the values of Authentication.user to be changed to scope.user
			expect(Authentication.user.name).toEqual('Fred');
			expect(Authentication.user.researchinterests).toEqual('Food');
		});

		it('$scope.updateUserProfile() should just display error message if backend responds with an error', function(){
			$httpBackend.expectPUT('users').respond(400, {message:'Failed to update user'});

			scope.user = [{name:'Fred'},{researchinterests:'Food'}]; //The newly defined user

			scope.updateUserProfile(true);
			$httpBackend.flush();

			//Expect scope.error to equal error response
			expect(scope.error).toEqual('Failed to update user');
			//The Authentication.user should not be defined if the update failed.
			expect(Authentication.user).toBeUndefined(); 
		});

		it('$scope.changeUserPassword() should clear the form when the password is successfully change', function(){
			$httpBackend.expect('POST', '/users/password').respond(200, 'Password Changed Successfully');

			scope.changeUserPassword();
			$httpBackend.flush();

			expect(scope.success).toEqual(true);
			expect(scope.passwordDetails).toEqual(null);
		});

		it('$scope.changeUserPassword() should display error message if password change was unsuccessful', function(){
			$httpBackend.expect('POST', '/users/password').respond(400, {message:'Password Change Failed'});

			scope.changeUserPassword();
			$httpBackend.flush();

			expect(scope.error).toEqual('Password Change Failed');
			expect(scope.success).toBeNull();
		});

		it('$scope.toggleEditPortfolio() should correctly toggle the boolean value in the scope', function(){
			scope.editPortfolioBoolean = false;

			scope.toggleEditPortfolio();
			expect(scope.editPortfolioBoolean).toEqual(true);
		});

		it('$scope.checkEditPortfolio() should correctly check the boolean value in the scope', function(){
			scope.editPortfolioBoolean = false;

			var result = scope.checkEditPortfolio();
			expect(result).toEqual(false);
		});

		it('$scope.removeElementfromPortfolio() should remove the correct portfolio from $scope.user.portfolios', function(){
			// Define a sample portfolio
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];

			// Define a sample user
			var sampleUser = {firstName: 'Joe', portfolios: samplePortfolio};

			//We must do angular copy or else the sampleUser would be passed by reference instead of by value
			scope.user={};
			Authentication.user = {};
			angular.copy(sampleUser, scope.user);
			angular.copy(sampleUser, Authentication.user);

			//Remove the last element
			scope.removeElementfromPortfolio(2);
			expect(scope.user.portfolios).toEqual(['3aA', '4bB']);

		});

		it('$scope.removeElementfromPortfolio() should remove the correct portfolio from Authentication.user.portfolios', function(){
			// Define a sample portfolio
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];

			// Define a sample user
			var sampleUser = {firstName: 'Joe', portfolios: samplePortfolio};

			//We must do angular copy or else the sampleUser would be passed by reference instead of by value
			scope.user={};
			Authentication.user = {};
			angular.copy(sampleUser, scope.user);
			angular.copy(sampleUser, Authentication.user);

			//Remove the last element
			scope.removeElementfromPortfolio(2);
			expect(Authentication.user.portfolios).toEqual(['3aA', '4bB']);

		});

		it('$scope.removeBadPortfolioEntries() should correctly remove pf entries from $scope.user that no longer represent a valid DB', function(){
			// Define a sample portfolio
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];

			// Define a sample user
			var sampleUser = {firstName: 'Joe', portfolios: samplePortfolio};

			//We must do angular copy or else the sampleUser would be passed by reference instead of by value
			scope.user={};
			Authentication.user = {};
			angular.copy(sampleUser, scope.user);
			angular.copy(sampleUser, Authentication.user);

			//Define user after removing bad pf entry
			var newUser = {firstName: 'Joe', portfolios: ['3aA', '525a8422f6d0f87f0e407a33']};

			//Simulate backend response if no DB is found matching the id '4bB'
			$httpBackend.expectGET('databases/4bB').respond(400, 'No DB exists');
			$httpBackend.expectPUT('users').respond(200, newUser);

			scope.removeBadPortfolioEntries(1); //Use 1 as argument because it is index of '4bB'
			$httpBackend.flush();

			expect(scope.user.portfolios).toEqual(['3aA', '525a8422f6d0f87f0e407a33']);
		});

		it('$scope.removeBadPortfolioEntries() should correctly remove pf entries from Authentication.user that no longer represent a valid DB', function(){
			// Define a sample portfolio
			var samplePortfolio = ['3aA', '4bB', '525a8422f6d0f87f0e407a33'];

			// Define a sample user
			var sampleUser = {firstName: 'Joe', portfolios: samplePortfolio};

			//We must do angular copy or else the sampleUser would be passed by reference instead of by value
			scope.user={};
			Authentication.user = {};
			angular.copy(sampleUser, scope.user);
			angular.copy(sampleUser, Authentication.user);

			//Define user after removing bad pf entry
			var newUser = {firstName: 'Joe', portfolios: ['3aA', '525a8422f6d0f87f0e407a33']};

			//Simulate backend response if no DB is found matching the id '4bB'
			$httpBackend.expectGET('databases/4bB').respond(400, 'No DB exists');
			$httpBackend.expectPUT('users').respond(200, newUser);

			scope.removeBadPortfolioEntries(1); //Use 1 as argument because it is index of '4bB'
			$httpBackend.flush();

			expect(Authentication.user.portfolios).toEqual(['3aA', '525a8422f6d0f87f0e407a33']);
		});

		it('$scope.open(size) should open modal and cancel option to delete account', function(){
			$location.path('/settings/edit'); //Go to edit profile page
			scope.open('sm');
			scope.$dismiss();
			expect($modal.templateURL).toEqual('delete-modal.client.view.html');
		});

		it('$scope.open(size) should open modal and should display error message if password is incorrect', function(){
			$httpBackend.expect('POST', '/users/verify').respond(400, {message:'Incorrect Password'});
			$location.path('/settings/edit'); //Go to edit profile page
			scope.open('sm');
			scope.password = {password: 'foo'};
			expect(scope.error).toEqual('Incorrect Password');
			expect(scope.success).toBeNull();
		});
	});
}());
