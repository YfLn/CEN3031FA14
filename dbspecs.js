var dbname = element(by.model('name'));
var url = element(by.model('url'));
var isFree = element(by.model('isFree'));
var shortDescription = element(by.model('descriptionShort'));
var longDescription = element(by.model('descriptionLong'));
var dblist = element.all(by.repeater('database in databases'));
var query = element(by.id('query'));
var deletebutton = element(by.id('delButton'));
var editButton = element(by.id('editButton'));
var addbutton = element(by.id('addDBButton'));
var removebutton = element(by.id('removeDBButton'));
var porlist = element.all(by.repeater('portfolio in user.portfolios'));
var dbClicker = element(by.id('dbClick'));
var searchOption = element(by.model('searchKey'));
var nameChoice = element(by.id('nameChoice'));
var descChoice = element(by.id('descChoice'));
var submitAdd = element(by.id('submitAdd'));
var DatabaseName = element(by.id('DBName'));
var editDB = element(by.id('name'));
var editSubmit = element(by.id('editSubmit'));

describe('Databases', function(){
	it ('should be able to create a database', function(){
		browser.driver.get('http://localhost:3000/#!/databases'); 
		element(by.linkText('Databases')).click();
		element(by.linkText('New Database')).click();

		dbname.sendKeys('Test Database 1');
		url.sendKeys('http://www.test1url.com');
		isFree.click();
		shortDescription.sendKeys('This is the first test database. Gypsum.')
		longDescription.sendKeys('Longer description for the test database number one.');

		element(by.buttonText('Create Database')).click();
		browser.get('http://localhost:3000/#!/databases');

		expect(dblist.count()).toEqual(31);
	});

	it('should not create a DB if there is an error', function(){
		browser.driver.get('http://localhost:3000/#!/databases'); 
		element(by.linkText('Databases')).click();
		element(by.linkText('New Database')).click();		
		dbname.sendKeys('Test Database To Fail');
		url.sendKeys('www.failURL.com');
		isFree.click();
		shortDescription.sendKeys('This DB should fail because the URL is wrong.')
		longDescription.sendKeys('The URL should contain an http:// link but it does not.');

		element(by.buttonText('Create Database')).click();
		expect($('[data-ng-show="error"]').isDisplayed()).toBeTruthy();

		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(31);

	});

	it('should filter through the database list', function(){
		browser.driver.get('http://localhost:3000/#!/databases'); 
		expect(dblist.count()).toBe(31);

		searchOption.click();
		descChoice.click();

		query.sendKeys('Gypsum');
		expect(dblist.count()).toBe(1);

		query.clear();
		searchOption.click();
		nameChoice.click();
		query.sendKeys('Internet');
		expect(dblist.count()).toBe(5);

		query.clear();
		query.sendKeys('Internet Public');
		expect(dblist.count()).toBe(1);

		query.clear();
		searchOption.click();
		nameChoice.click();

		query.sendKeys('animal');
		expect(dblist.count()).toBe(1);
		query.clear();

	});

	it('should add a DB to a portfolio', function(){
		browser.get('http://localhost:3000/#!/databases');
		dbClicker.click();

		addbutton.click(); 

		element(by.id('proficient')).click();

		submitAdd.click();

		element(by.id('dispName')).click();		
		expect(porlist.count()).toBe(1);



	});

	it('should remove a DB from a portfolio',function(){
		browser.get('http://localhost:3000/#!/databases');
		query.clear();
		searchOption.click();
		descChoice.click();
		query.sendKeys('Gypsum');

		dbClicker.click();

		removebutton.click(); 

		element(by.id('dispName')).click();		

		expect(porlist.count()).toBe(0);

	});


});
