var login = require('./login.js')
var fs = require('fs');
var settings = JSON.parse(fs.readFileSync('settings.txt'));

module.exports = {
	logIntoChat: function(){
		login.getCommunity().chatLogon(500,'web')
	},

	sendChat: function(text){
		login.getCommunity().chatMessage(settings.secondayAccount,text,function(err){
			if(err){
				console.log(err)
			}
		})
	}
}

