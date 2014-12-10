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
var porlist = element.all(by.repeater('portfolio in user.portfolios'));
var dbClicker = element(by.id('dbClick'));
var searchOption = element(by.model('searchKey'));
var nameChoice = element(by.id('nameChoice'));
var descChoice = element(by.id('descChoice'));
var submitAdd = element(by.id('submitAdd'));
var DatabaseName = element(by.id('DBName'));
var editDB = element(by.id('name'));
var editSubmit = element(by.id('editSubmit'));
var reviews = element(by.model('reviews'));
var commentSubmit = element(by.id('commentSubmit'));
var commentNumber = element.all(by.repeater('comment in dbComments'));
var delComment = element(by.id('delComment'));

describe('Editing DBs', function(){

	it ('should be able to edit a database', function(){
		browser.driver.get('http://localhost:3000/#!/databases'); 
		query.clear();
		searchOption.click();
		descChoice.click();
		query.sendKeys('Gypsum');

		dbClicker.click();

		editButton.click(); 

		editDB.clear(); 
		editDB.sendKeys('Test Database 5000');

		editSubmit.click(); 
		expect($('[data-ng-show="error"]').isDisplayed()).toBeFalsy();

	});

	it('should be able to add a comment',function(){
		reviews.sendKeys('This is a review.');
		commentSubmit.click(); 

		expect($('[data-ng-show="error"]').isDisplayed()).toBeFalsy();

		expect(commentNumber.count()).toBe(1);

		reviews.clear();
	});

	it('should be able to delete a comment',function(){
		delComment.click();
		expect($('[data-ng-show="error"]').isDisplayed()).toBeFalsy();

	});

	it('should delete the DBs', function(){
		browser.get('http://localhost:3000/#!/databases');
		searchOption.click();
		descChoice.click();
		query.sendKeys('Gypsum');
		dbClicker.click();
		deletebutton.click();
		browser.get('http://localhost:3000/#!/databases');
		expect(dblist.count()).toBe(30);
	});

});
