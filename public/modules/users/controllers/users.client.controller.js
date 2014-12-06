'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Users', 'Databases', 'Authentication',
	function($scope, $stateParams, $location, Users, Databases, Authentication) {
		$scope.authentication = Authentication;
		$scope.user = {};
		$scope.users = {};
		
		//retrieve a list of users in the website
		$scope.findAllUsers = function(){
			$scope.users = Users.query();
		};

		//Retrieve a specific user from the back end
		$scope.findOneUser = function() {
			$scope.user = Users.get({userId: $stateParams.userId}, function() {
				$scope.findUserPortfolio();
			});
		};

		//Retrieve user's portfolio
		$scope.findUserPortfolio = function() {		
			//Must save initial count because we will be changing this array
			var initPortCount = $scope.user.portfolios.length;

			for(var i = 0; i < initPortCount; i++)
			{
				//Call method to remove bad portfolios from (Authentication/$scope).user.portfolios
				//Needed a separate method to preserve the current i value when the async request is made (Databases.get)
				$scope.removeBadPortfolioEntries(i);
			}
		};

		//Clean up bad/dead database entries in user's portfolio
		$scope.removeBadPortfolioEntries = function(i){

			var databaseID =  $scope.user.portfolios[i];

			//Execute async request to get db
			var result = Databases.get({databaseId: databaseID}, 
				function() {
					var index = $scope.user.portfolios.indexOf(databaseID);
					$scope.user.portfolios[index] = result; //Update $scope.user.portfolios
				}, 
				function() {
					var index = $scope.user.portfolios.indexOf(databaseID);
					//console.log('Dead database removed from portfolio. id:' + $scope.user.portfolios[index]);
					if(index !== -1)
						$scope.user.portfolios.splice(index, 1); //Remove the bad db
			});	
		};

		//Sort order variable for users list
		$scope.sortorder = 'displayname';

		$scope.isAdmin = function(){
			return angular.equals(Authentication.user.roles, ['admin']);
		};
	} 
]);