'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var databases = require('../../app/controllers/databases');

	// Databases Routes
	app.route('/databases')
		.get(databases.list)
		.post(users.requiresLogin, databases.create);

	app.route('/databases/:databaseId')
		.get(databases.read)
		.put(users.requiresLogin, databases.hasAuthorization, databases.update)
		.delete(users.requiresLogin, databases.hasAuthorization, databases.delete);

	// Finish by binding the Database middleware
	app.param('databaseId', databases.databaseByID);
};