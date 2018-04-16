var login = require('./login.js')
var inventory = require('./inventory.js')
var tracker = require('./tracker.js')
var promise = require('promise')
var chat = require('./chat')

tracker.updateCurrency()

login.performLogin().then(function(response){
	chat.logIntoChat()
	console.log("logged In")
	var buy = inventory.getNormalBuyList()
	var sell = inventory.getSellList()
	promise.all([buy,sell]).then(function(values){
		console.log("fetched buy/sell List")
		tracker.trackItem(values)
	})

}).catch(function(err){
	console.log("steam api ist reponding please run script again")
	process.exit()
})

//things to do:
//do duplicate flag 
//check if sell item in inventory
//fix inventory to fetch once 
//add a secondary account to send messeges to 









