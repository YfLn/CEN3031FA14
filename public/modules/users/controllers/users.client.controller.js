'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication',
	function($scope, $stateParams, $location, Users, Authentication) {
		$scope.authentication = Authentication;
		$scope.user = {};
		//angular.copy(Authentication.user, $scope.user);
		$scope.users = Users.query();

		$scope.find = function(){
			$scope.users = Users.query();
		};

		$scope.findOne = function() {
			$scope.user = Users.get({userId: $stateParams.userId});
			//console.log($stateParams.userId);
			//console.log($scope.user);
		};

		//Sort order variable for users list
		$scope.sortorder = 'displayname';
	} 
]);