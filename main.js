var login = require('./login.js')
var inventory = require('./inventory.js')
var tracker = require('./tracker.js')
var promise = require('promise')
var chat = require('./chat')
const { spawn } = require('child_process');

function start(){
	console.clear()
	tracker.updateCurrency()

	login.performLogin().then(function(response){
		chat.logIntoChat()
		console.log("logged In")
		var buy = inventory.getNormalBuyList()
		var sell = null
		setTimeout(function () { sell = inventory.getSellList()}, 1000)
		
		promise.all([buy,sell]).then(function(values){
			console.log("fetched buy/sell List")
			tracker.trackItem(values)
		})

	}).catch(function(err){
		if (err == "Error: HTTP error 403"){
			console.log("you have reached the rate limit allowed by steam, you can bypass this by changing your IP address by using a VPN like TunnelBear: https://www.tunnelbear.com")
		}else{
			console.log(err)
			console.log("steam api ist reponding please run script again")		
		}
		process.exit()
		
	})
}
start()
if (inventory.getSettings().loop){
	setInterval(function() {
		start()
	},(1000*60)*inventory.getSettings().restartTime)
}



 











