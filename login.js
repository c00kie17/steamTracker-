var gbl = require('./global.js')
var promise = require('promise')
var buysell = require('./buysell')
var tracker = require('./tracker')

var hourCounter = 0

gbl.getClient().on('steamGuard', function(domain, callback) {
	console.log("Steam Guard code needed from email ending in " + domain);
	callback(code);
});

gbl.getClient().on('loggedOn', function(details) {
	console.log("Logged in");
});

gbl.getClient().on('wallet', function(hasWallet, currency, balance) {
	gbl.setBalance(balance)
});

gbl.getClient().on('webSession', function(sessionID, cookies) {
	gbl.getCommunity().setCookies(cookies);
	gbl.setsessionID(sessionID)
	fetchUser().then(function(){
		start()
	}).catch(function(err){
		if(err == "Error: HTTP error 403"){
			console.log("you have reached the rate limit allowed by steam, you can bypass this by changing your IP address by using a VPN like hotspotshield: https://www.hotspotshield.com")
		}else{
			console.log(err)
			console.log("an error occoured please try again")
		}
	})
});

gbl.getClient().on('error', function(e) {
	if (e == "Error: RateLimitExceeded"){
		console.log("you have reached the rate limit allowed by steam, you can bypass this by changing your IP address by using a VPN like hotspotshield: https://www.hotspotshield.com")
	}else{
		console.log("steam api ist reponding please run script again")
	}
});

module.exports = {

	performLogin: function(){
		gbl.getClient().logOn({
			"accountName": gbl.getSettings().username,
			"password": gbl.getSettings().password
		});
	}

} 



function start(){
	console.clear()
	gbl.loadSettings()
	gbl.updateCurrency()
	fetchInventory().then(function(){
		console.log("Fetched Inventory")
		var buy  = buysell.getBuyList()
		var sell = buysell.getSellList()
		promise.all([buy,sell]).then(function(values){
			console.log("Fetched buy/sell list")
			tracker.trackItem(values).then(function(){
				console.log("Done tracking items")
				if(gbl.getSettings().loop){
					wait()
				}else{
					process.exit()
				}
			})
		})		
	})
}

function fetchInventory(){
	return new promise(function(complete,reject){
		gbl.getUser().getInventoryContexts(function(err,apps){
			if(err){
				console.log("an error occoured, trying to fetch inventory again")
				fetchInventory()
			}else{
				promseList = []
				for(game in apps){
					promseList.push(getGameInventory(game))
				}
				promise.all(promseList).then(function(values){
					inventoryList = [].concat.apply([], values);
					gbl.setInventory(inventoryList)
					complete()		
				}).catch(function(err){
					console.log("an error occoured, trying to fetch inventory again")
					fetchInventory()
				})
			}
		})	
	})	
}

function getGameInventory(appid){
	return new promise(function(complete,reject){
		gbl.getUser().getInventoryContents(appid.toString(),2,false,function(err,inventory){
			if(err){
				reject(err)
			}else{
				complete(inventory)
			}
		})
	})
}

function fetchUser(){
	return new promise(function(complete,reject){
		gbl.getCommunity().getSteamUser(gbl.getCommunity().steamID,function(err,user){
			if(err){
				reject(err)
			}else{
				gbl.setUser(user)
				complete()
			}
		})
	})
}

function wait(){
	if (hourCounter > 300){
		gbl.cleatItemList()
		hourCounter = 0
	}
	hourCounter = hourCounter + gbl.getSettings().restartTime
	var options = {weekday: "long", year: "numeric", month: "short",  day: "numeric", hour: "2-digit", minute: "2-digit" }
	var latest = new Date()
	differenceVal = latest.getTime() + (gbl.getSettings().restartTime * 60000)
	var nextcheck = new Date(differenceVal);
	console.clear()
	console.log("the next check will occour on: "+nextcheck.toLocaleTimeString("en-us", options))
	setTimeout(function() {
		start()
	},(1000*60)*gbl.getSettings().restartTime)
	
}





