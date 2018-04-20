var gbl = require('./global.js')
var https = require('https');
var querystring = require('querystring');
require('chromedriver');
var webdriver = require('selenium-webdriver');
var driver = null



module.exports = {
	sellitem: function(item,price){
		driver = new webdriver.Builder()
  			.forBrowser('chrome')
  			.build();
  		var By = webdriver.By
		var until = webdriver.until	
		driver.get('https://steamcommunity.com/profiles/'+gbl.getClient().steamID.toString()+'/inventory/#'+item._appid);
		cookies = gbl.getCookies()
		for (var i = 0; i < cookies.length; i++) {
			driver.manage().addCookie({"name":cookies[i][0],  "value":cookies[i][1]}).catch(function(err){
				console.log(err)
			},'/profiles/'+gbl.getClient().steamID.toString()+'/inventory/#'+item._appid,'https://steamcommunity.com');
		}
		driver.wait(until.elementLocated(By.linkText('login')), 2000).then(function(elm) {
			driver.findElement(By.linkText('login')).click();
		})
		driver.wait(until.elementLocated(By.id('filter_control')), 2000).then(function(elm) {
			var searchBar = driver.findElement(By.id('filter_control'))
			driver.manage().timeouts().implicitlyWait(2000);
			searchBar.sendKeys(item._hashName);
		})
		
	}
}

function takesc(){
	driver.takeScreenshot().then(
	    function(image, err) {
	    	if(err){
	    		console.log(err)
	    	}else{
	    		require('fs').writeFile('out.png', image, 'base64', function(err) {
	            	console.log(err);
	        	});
	    	}   
	    }
	);
}