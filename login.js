var term = require( 'terminal-kit' ).terminal
var promise = require('promise')
var fs = require('fs');
var ReadLine = require('readline');
var SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();
var userVal = null

var rl = ReadLine.createInterface({
	"input": process.stdin,
	"output": process.stdout
});

module.exports = {

	performLogin: function(){
		return new promise(function(complete,reject){
			oAuthLogin().then(function(response){
				complete()
			}).catch(function(err){
				//console.log(err)
				manualLogin().then(function(response){
					complete()
				}).catch(function(err){
					reject(err)
				})
			})
		})	
	},

	getUser: function(){
		return userVal
	},

	getCommunity: function(){
		return community
	}

	
} 

function oAuthLogin(){
	return new promise(function(complete,reject){
		fs.readFile('login.txt', function (err, data) {
  			if (err){
  				reject(err);
  			} 
  			else{
  				
  				try{
  					data = JSON.parse(data)
  					community.oAuthLogin(data.steamguard,data.oAuthToken,function(err){
	   					if(err){
	   						reject(err)
	   					}else{
	   						getUser().then(function(){
	   							complete()
	   						}).catch(function(err){
	   							reject(err)
	   						})
	   					}
   					})
  				}catch(err){
  					console.log("login details expired or not available, please login again")
  					manualLogin().then(function(){
  						complete()
  					})
  				}
   				
  			}
		});
	})
}

function saveDetails(steamguard,oAuthToken){
	data = JSON.stringify({'steamguard':steamguard,'oAuthToken':oAuthToken})
	fs.writeFile("login.txt",data, function(err) {
	    if(err) {
	        console.log(err);
	    }
	}); 
}

function getUser(){
	return new promise(function(complete,reject){
		community.getSteamUser(community.steamID,function(err,user){
			if(err){
				reject(err)
			}else{
				userVal = user
				complete()
			}
		})
	})
}

function manualLogin(){
	return new promise(function(complete,reject){
		rl.question("Username: ", function(accountName) {
			rl.question("Password: ", function(password) {
				rl.question("SteamGuard :" , function(steamguardVal){
					community.login({
						"accountName": accountName,
						"password": password,
						"twoFactorCode": steamguardVal
					}, function(err,sessionID, cookies, steamguard,oAuthToken){
						if(err){
							reject(err)
						}
						loginDetails = {"community":community,"sessionID":sessionID,"steamguard":steamguard,"oAuthToken":oAuthToken}
						saveDetails(steamguard,oAuthToken)
						getUser().then(function(){
   							complete()
   						}).catch(function(err){
   							reject(err)
   						})
					})
				});
			});
		});	
	})	
}



