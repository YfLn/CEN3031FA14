// spec.js
var username = element(by.model('credentials.username'));
var password = element(by.model('credentials.password'));
var fname = element(by.model('credentials.firstName'));
var lname = element(by.model('credentials.lastName'));
var research = element(by.model('credentials.researchinterests'));


describe('Getting to the homepage', function() {
  it('should have a title', function() {
    browser.get('http://localhost:3000');

    expect(browser.getTitle()).toEqual('CEN3031FA14 - Development Environment');
  });
});

describe('Signing up', function() {
	it ('should be able to reject an existing username', function() {
		browser.get('http://localhost:3000/#!/signup');
		fname.sendKeys('TestFirst');
		lname.sendKeys('TestLast');
		username.sendKeys('Test@ufl.edu');
		password.sendKeys('test123');
		research.sendKeys('This is my research interests. I like to test. ');

	 	element(by.buttonText('Sign up')).click();
	
		expect($('[data-ng-show="error"]').isDisplayed()).toBeTruthy();
	});

	it ('should not sign up for a non-UFL email', function(){
		browser.get('http://localhost:3000/#!/signup');
		fname.sendKeys('TestFirst');
		lname.sendKeys('TestLast');
		username.sendKeys('Test@yahoo.edu');
		password.sendKeys('test123');
		research.sendKeys('This is my research interests. I like to test. ');

	 	element(by.buttonText('Sign up')).click();
	
		expect($('[data-ng-show="error"]').isDisplayed()).toBeTruthy();

	});
});

// can repeat above for each credential that is missing

describe('Logging in',function() {
	it ('should be able to log in', function() {
  	browser.get('http://localhost:3000');

  	username.sendKeys('test1@ufl.edu'); 
  	password.sendKeys('test123');

  	element(by.buttonText('Sign in')).click();

  	expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/databases');
  });
});

describe('Viewing your profile', function(){
	it ('should be able to view your profile', function(){
		browser.get('http://localhost:3000/#!/databases');
		element(by.linkText('TestFirst TestLast')).click();
		element(by.linkText('View Profile')).click();

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/settings/profile');

	});
});

var dbname = element(by.model('name'));
var url = element(by.model('url'));
var isFree = element(by.model('isFree'));
var shortDescription = element(by.model('descriptionShort'));
var longDescription = element(by.model('descriptionLong'));
var dblist = element.all(by.repeater('database in databases'));
var query = element(by.model('query'));
var deletebutton = element(by.className('glyphicon-trash'));
var addbutton = element(by.className('addDatabases'));
var porlist = element.all(by.repeater('portfolio in user.portfolios'));

describe('Databases', function(){
	it ('should be able to create a database', function(){
		browser.get('http://localhost:3000/#!/databases'); 
		element(by.linkText('Databases')).click();
		element(by.linkText('New Database')).click();

		dbname.sendKeys('Test Database 1');
		url.sendKeys('http://www.test1url.com');
		isFree.click();
		shortDescription.sendKeys('This is the first test database. Gypsum.')
		longDescription.sendKeys('Longer description for the test database number one.');

		element(by.buttonText('Create Database')).click();
		browser.get('http://localhost:3000/#!/databases');

		expect(dblist.count()).toBe(1);
	});

	it('should not create a DB if there is an error', function(){
		browser.get('http://localhost:3000/#!/databases/create');
		dbname.sendKeys('Test Database To Fail');
		url.sendKeys('www.failURL.com');
		isFree.click();
		shortDescription.sendKeys('This DB should fail because the URL is wrong.')
		longDescription.sendKeys('The URL should contain an http:// link but it does not.');

		element(by.buttonText('Create Database')).click();
		expect($('[data-ng-show="error"]').isDisplayed()).toBeTruthy();

		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(1);

	});

	it('should populate the database list, then filter through it', function(){
		browser.get('http://localhost:3000/#!/databases/create');
		dbname.sendKeys('Test Database 2');
		url.sendKeys('http://www.testbase2.net');
		isFree.click();
		shortDescription.sendKeys('This is the second test database. Boston.')
		longDescription.sendKeys('Second test DB.');

		element(by.buttonText('Create Database')).click();

		browser.get('http://localhost:3000/#!/databases/create');
		dbname.sendKeys('Test Database 3');
		url.sendKeys('http://www.testbase3.com');
		isFree.click();
		shortDescription.sendKeys('This is the third test database. Boston Celtics')
		longDescription.sendKeys('Third test DB.');

		element(by.buttonText('Create Database')).click();

		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(3);

		query.sendKeys('Gypsum');
		expect(dblist.count()).toBe(1);

		query.clear();
		query.sendKeys('Boston');
		expect(dblist.count()).toBe(2);

		query.clear();
		query.sendKeys('Boston Celtics');
		expect(dblist.count()).toBe(1);

	});

	it('should add a DB to a portfolio', function(){
		browser.get('http://localhost:3000/#!/databases');
		element.all(by.repeater('database in databases')).get(0).click();
		addbutton.click();
		browser.get('http://localhost:3000/#!/settings/profile');
		expect(porlist.count()).toBe(1);

	});

	it('should delete the DBs', function(){
		browser.get('http://localhost:3000/#!/databases');
		element.all(by.repeater('database in databases')).get(0).click();
		deletebutton.click();
		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(2);

		element.all(by.repeater('database in databases')).get(0).click();
		deletebutton.click();
		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(1);

		element.all(by.repeater('database in databases')).get(0).click();
		deletebutton.click();
		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(0);


	});

});

describe('Signing off', function(){
	it('should be able to sign out', function(){

	browser.get('http://localhost:3000/#!/databases');
	element(by.linkText('TestFirst TestLast')).click();
	element(by.linkText('Signout')).click();

	expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/');
	});

});
