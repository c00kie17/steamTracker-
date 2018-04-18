var login = require('./login.js')
var fs = require('fs');
var inventory = require('./inventory.js')


module.exports = {
	logIntoChat: function(){
		login.getCommunity().chatLogon(500,'web')
	},

	sendChat: function(text){
		login.getCommunity().chatMessage(inventory.getSettings().secondayAccount,text,function(err){
			if(err){
				console.log(err)
			}
		})
	}
}

