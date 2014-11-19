'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$timeout','$location', 'Users', 'Authentication',  'Databases', '$modal',
	function($scope, $http, $timeout, $location, Users, Authentication, Databases, $modal) {

		$scope.accountResult = false;
		$scope.user ={};
		angular.copy(Authentication.user, $scope.user); 
		//Deep copy so that changes can be reverted


		$scope.originalUser = {}; //Keep the original copy of the user
		angular.copy($scope.user, $scope.originalUser);
		
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		$scope.authentication = Authentication;

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		$scope.cancelChanges = function(){
			Authentication.user = $scope.originalUser;
		};

		// Redirect to View profile page after a certain number of ms
		$scope.redirectToViewProfile = function(ms){
			$timeout(function(){
					$location.path('/settings/profile');
				},ms);
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;
			//console.log($scope.passwordDetails);
			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		//Modal settings and functions
		$scope.open = function (size) {
			$scope.modalInstance = $modal.open({
		      templateUrl: 'deleteAccountModal',
		      controller: 'SettingsController',
		      size: size,
		      backdrop: 'static',
		      scope: $scope
		   	});
		};

		//Deactivate user account
		$scope.deleteAccount = function(passwordModal){
		
			$scope.success = $scope.error = null;
			$scope.passwordModal = passwordModal;
			
			$http.post('/users/verify', $scope.passwordModal).success(function(response) {				

				$scope.success = true;
				$location.path('/auth/signout');
				Authentication.user = null;
				$scope.modalInstance.dismiss('delete');

			}).error(function(response) {
				$scope.error = 'Please enter the correct password';
			});
		};

		// Find existing Database in Porfolio
		$scope.findAll = function() {		
			//Must save initial count because we will be changing this array
			var initPortCount = Authentication.user.portfolios.length;
			for(var i = 0; i < initPortCount; i++)
			{
				//Call method to remove bad portfolios from (Authentication/$scope).user.portfolios
				//Needed a separate method to preserve the current i value when the async request is made (Databases.get)
				$scope.removeBadP(i);
			}
		};

		$scope.removeBadP = function(i){
			var databaseID =  Authentication.user.portfolios[i];
			//Execute async request to get db
			var result = Databases.get({databaseId: databaseID}, 
				function() {
					//console.log('success');
					var index = $scope.user.portfolios.indexOf(databaseID);
					$scope.user.portfolios[index] = result; //Update $scope.user.portfolios
					$scope.finishEditPortfolio();
				}, 
				function() {
					var index = $scope.user.portfolios.indexOf(databaseID);
					console.log('Dead database removed from portfolio. id:' + $scope.user.portfolios[index]);
					if(index !== -1)
						$scope.removeDBfromP(index); //Remove the bad db
					$scope.finishEditPortfolio(); 
			});	
			//It appears as if each time finishEditPf is called, it will fail if there is already another async request being processed.
		};

		var editPortfolioBoolean = false;

		$scope.toggleEditPortfolio = function () {
			if(editPortfolioBoolean === false) {editPortfolioBoolean = true; console.log('toggled');}
			else {editPortfolioBoolean = false;}
		};

		$scope.checkEditPortfolio = function () {
			if(editPortfolioBoolean === false) {return false;}
			if(editPortfolioBoolean === true) {return true;}
		};

		$scope.removeDBfromP = function(portfolio_arg) {
			$scope.user.portfolios.splice(portfolio_arg,1);
			Authentication.user.portfolios.splice(portfolio_arg,1);
		};

		$scope.finishEditPortfolio = function() {
			var user = new Users(Authentication.user);

			user.$update(function(response) {
				$scope.success = true;
				Authentication.user = response;
			}, function(response) {
				$scope.error = response.data.message;
			});
		};
	}
]);

/*angular.module('users').controller('ModalController', ['$scope', '$http', '$timeout','$location', 'Users', 'Authentication',  'Databases', '$modalInstance',
	function($scope, $http, $timeout, $location, Users, Authentication, Databases, $modalInstance) {

		$scope.accountResult = false;
		$scope.user ={};
		angular.copy(Authentication.user, $scope.user); 
		//Deep copy so that changes can be reverted


		$scope.originalUser = {}; //Keep the original copy of the user
		angular.copy($scope.user, $scope.originalUser);
		
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		$scope.authentication = Authentication;

		$scope.deleteAccount = function(){
		
			$scope.success = $scope.error = null;
			$http.post('/users/verify', $scope.passwordModal).success(function(response) {				

				Authentication.user = response;

				$scope.modalInstance.dismiss('delete');

			}).error(function(response) {
				$scope.error = 'Please enter the correct password';
			});
		};
	}
]);*/


