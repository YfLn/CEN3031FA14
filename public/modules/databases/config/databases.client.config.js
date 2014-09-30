'use strict';

// Configuring the Articles module
angular.module('databases').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Databases', 'databases', 'dropdown', '/databases(/create)?');
		Menus.addSubMenuItem('topbar', 'databases', 'List Databases', 'databases');
		Menus.addSubMenuItem('topbar', 'databases', 'New Database', 'databases/create');
	}
]);