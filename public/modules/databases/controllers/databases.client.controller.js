'use strict';

// Databases controller
angular.module('databases').controller('DatabasesController', ['$scope', '$stateParams', '$location', 'Users', 'Authentication', 'Databases',
	function($scope, $stateParams, $location, Users, Authentication, Databases) {
		$scope.user = {};
		angular.copy(Authentication.user, $scope.user);
		$scope.authentication = Authentication;

		// Create new Database
		$scope.create = function() {
			// Create new Database object
			var database = new Databases ({
				name: this.name,
				descriptionShort: this.descriptionShort,
				descriptionLong: this.descriptionLong,
				isFree: this.isFree,
				url: this.url
			});

			// Redirect after save
			database.$save(function(response) {
				$location.path('databases/' + response._id);

				// Clear form fields
				$scope.name = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Database
		$scope.remove = function( database ) {
			if ( database ) { database.$remove();

				for (var i in $scope.databases ) {
					if ($scope.databases [i] === database ) {
						$scope.databases.splice(i, 1);
					}
				}
			} else {
				$scope.database.$remove(function() {
					$location.path('databases');
				});
			}
		};

		// Update existing Database
		$scope.update = function() {
			var database = $scope.database ;

			database.$update(function() {
				$location.path('databases/' + database._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Databases
		$scope.find = function() {
			$scope.databases = Databases.query();
		};

		// Find existing Database
		$scope.findOne = function() {
			$scope.database = Databases.get({ 
				databaseId: $stateParams.databaseId
			});
		};

		// Add databases into portfolio
		$scope.addDatabaseToPortfolio = function(arg_database) {
            $scope.success = $scope.error = null;
            var user = new Users(Authentication.user);
            var database = new Databases($scope.database);
            if(arg_database) {database = arg_database;}

            //Check if database is in portfolio. If not, add to portfolio.
            if (user.portfolios.indexOf(database._id) === -1) {
            	user.portfolios.push(database._id);
            	
                user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});        	
            }
        };

        //Checks for database in user's portfolio. Returns TRUE if database is NOT in portfolio.
        $scope.checkForDatabaseInPortfolio = function(arg_database) {
        	$scope.success = $scope.error = null;
        	var user = new Users(Authentication.user);
        	var database = new Databases($scope.database);
        	if(arg_database) {database = arg_database;}

        	if(user.portfolios.indexOf(database._id) === -1) {
        		return true;
        	}

        	return false;
        };

        $scope.removeDatabaseFromPortfolio = function(arg_database) {
        	$scope.success = $scope.error = null;
        	var user = new Users(Authentication.user);
        	var database = new Databases($scope.database);
        	if(arg_database) {database = arg_database;}

        	user.portfolios.splice(user.portfolios.indexOf(database._id), 1);

        	user.$update(function(response) {
        		$scope.success = true;
        		Authentication.user = response;
        		$scope.user = response;
        	}, function(response) {
        		$scope.error = response.data.message;
        	});
        };

		//sort order for the list database page
		$scope.sortorder = 'name';
	}
]);