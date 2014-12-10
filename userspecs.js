var dropdown = element(by.id('dropdownCaret'));
var userDirectory = element(by.id('userDirectory'));
var userlist = element.all(by.repeater('user in users'));
var query = element(by.id('query'));



describe('UserDirectories', function(){

	it('should be able to pull up the user directory', function(){
		browser.driver.get('http://localhost:3000/#!/databases'); 
		dropdown.click(); 
		userDirectory.click();

  		expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#!/settings/list');
	});

	it('should return the correct list of users', function(){
		expect(userlist.count()).toEqual(30);

	});

	it('should search research topics through the list of users', function(){
		query.sendKeys('Endangered Species');
		expect(userlist.count()).toEqual(2);
		query.clear();
	});

	it('should search email through the list of users', function(){
		query.sendKeys('24@ufl.edu');
		expect(userlist.count()).toEqual(1);
		query.clear();
	});

	it('should search username through the list of users', function(){
		query.sendKeys('Kena');
		expect(userlist.count()).toEqual(1);
		query.clear();
	});


});