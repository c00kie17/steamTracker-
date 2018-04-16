var login = require('./login.js')


module.exports = {
	logIntoChat: function(){
		login.getCommunity().chatLogon(500,'web')
	},

	sendChat: function(text){
		login.getCommunity().chatMessage('76561198298683833',text,function(err){
			if(err){
				console.log(err)
			}
		})
	}
}

