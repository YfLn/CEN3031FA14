'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in and not an administrator then redirect back home
		if ($scope.authentication.user && $scope.authentication.user.roles.indexOf('admin') === -1) $location.path('/databases');

		$scope.signup = function() {
			//If user is not logged in or not an administrator, check if UFL email address
			if(!$scope.authentication.user || $scope.authentication.user.roles.indexOf('admin') === -1) {
				var match = $scope.credentials.username.match(/^.*@ufl\.edu$/);
				if(match === null) {
					$scope.error = 'You must use a valid UFL email address';
				}
				else {
					//email address is valid, continue with signup
					$http.post('/auth/signup', $scope.credentials).success(function(response) {
						// If successful we assign the response to the global user model
						
						$scope.authentication.user = response;
						// And redirect to the index page
						$location.path('/databases');
					}).error(function(response) {
						$scope.error = response.message;
					});
				}
			}
			//user is an administrator
			else {
				$http.post('/auth/signup', $scope.credentials).success(function(response) {
					// And redirect to the index page
					$location.path('/databases');
				}).error(function(response) {
					$scope.error = response.message;
				});				
			}
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/databases');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.verifyEmail = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/verification/' + $stateParams.token).success(function(response) {
				console.log('verify email called');
				// Attach user profile
				Authentication.user = response;
				//$scope.error = 'none';
				$location.path('/verify');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);