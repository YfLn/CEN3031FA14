'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$timeout','$location', 'Users', 'Authentication',  'Databases', '$modal',
	function($scope, $http, $timeout, $location, Users, Authentication, Databases, $modal) {

		$scope.accountResult = false;
		$scope.user ={};
		angular.copy(Authentication.user, $scope.user); //Deep copy so that changes can be reverted

		$scope.originalUser = {}; //Keep the original copy of the user
		angular.copy($scope.user, $scope.originalUser);
		
		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

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

			var modalInstance = $modal.open({
		      templateUrl: 'delete-modal.client.view.html',
		      controller: 'ModalController',
		      size: size
		    });
		};

		// Find existing Database in Porfolio
		$scope.findAll = function() {		
			
			for(var i = 0; i < $scope.user.portfolios.length; i++)
			{
				console.log($scope.user);
				$scope.user.portfolios[i] = Databases.get({databaseId: Authentication.user.portfolios[i]});
			}
		};
	}
]);

angular.module('users').controller('ModalController', ['$scope', '$modalInstance', '$http', '$timeout', '$location', 'Users', 'Authentication',
	function($scope, $http, Users, $timeout, $location,$modalInstance, Authentication) {

		$scope.user ={};
		angular.copy(Authentication.user, $scope.user); //Deep copy so that changes can be reverted

		$scope.originalUser = {}; //Keep the original copy of the user
		angular.copy($scope.user, $scope.originalUser);

		$scope.ok = function(){
			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				
				$scope.Authentication.user = response;

				
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);


