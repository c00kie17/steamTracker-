var gbl = require('./global.js')
var https = require('https');
var querystring = require('querystring');
require('chromedriver')
var webdriver = require('selenium-webdriver');
var SteamTotp = require('steam-totp');




module.exports = {
	sellitem: function(item,price,callback){
		inventoryItem = gbl.fetchfromInventory(item._hashName)
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
			},'/profiles/'+gbl.getClient().steamID.toString()+'/inventory/#'+item._appid,'https://steamcommunity.com')
		}
		driver.wait(until.elementLocated(By.linkText('login')), 2000).then(function(elm) {
			var loginBut = driver.findElement(By.linkText('login'))
			loginBut.click()
			driver.wait(until.stalenessOf(loginBut), 2000).then(function(elm) {
				var searchBar = driver.findElement(By.id('filter_control'))
				searchBar.sendKeys(item._hashName);
				driver.wait(until.elementLocated(By.id(item._appid+"_"+inventoryItem.contextid+"_"+inventoryItem.id)), 2000).then(function(elm) {
					var itemtoBuy = driver.findElement(By.id(item._appid+"_"+inventoryItem.contextid+"_"+inventoryItem.id))
					driver.wait(until.elementIsVisible(itemtoBuy), 3000).then(function(elm) {
						itemtoBuy.click()
						var itemtoBuy_pic = driver.findElement(By.id('iteminfo0_item_icon'))
						driver.wait(until.elementIsVisible(itemtoBuy_pic), 5000).then(function(elm) {
							driver.findElement(By.className('item_market_action_button item_market_action_button_green')).click()
							driver.wait(until.elementLocated(By.id('market_sell_buyercurrency_input')), 2000).then(function(elm) {
								buyerPrice = driver.findElement(By.id('market_sell_buyercurrency_input'))
								buyerPrice.sendKeys(price)
								driver.findElement(By.id('market_sell_dialog_accept_ssa')).click()
								driver.findElement(By.id('market_sell_dialog_accept')).click()
								driver.wait(until.elementLocated(By.id('market_sell_dialog_ok')), 2000).then(function(elm) {
									greenokbutton = driver.findElement(By.id('market_sell_dialog_ok'))
									driver.wait(until.elementIsVisible(greenokbutton), 5000).then(function(elm) {
										greenokbutton.click()
										driver.wait(until.elementLocated(By.className('btn_grey_white_innerfade btn_medium')), 2000).then(function(elm) {
											greyokbutton = driver.findElement(By.className('btn_grey_white_innerfade btn_medium'))
											driver.wait(until.elementIsVisible(greenokbutton), 5000).then(function(elm) {
												driver.close()
												gbl.getClient().getSteamGuardDetails(function(enabled){
	       											if(enabled){
	       												//gbl.getCommunity().
	       											}
	       										})
												//callback()
											})	
										})
									})
								})
							})
						})
					})
				})
			})
		})			
	}
}

function takesc(driver,filename){
	driver.takeScreenshot().then(
	    function(image, err) {
	    	if(err){
	    		console.log(err)
	    	}else{
	    		require('fs').writeFile(filename+'.png', image, 'base64', function(err) {
	            	console.log(err);
	        	});
	    	}   
	    }
	);
}