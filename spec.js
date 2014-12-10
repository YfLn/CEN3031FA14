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

  	username.sendKeys('1@ufl.edu'); 
  	password.sendKeys('rleon94');

  	element(by.buttonText('Sign in')).click();

  	expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/databases');
  });
});

describe('Viewing your profile', function(){
	it ('should be able to view your profile', function(){
		browser.get('http://localhost:3000/#!/databases');
		element(by.id('dispName')).click();

		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/settings/profile');

	});
});
