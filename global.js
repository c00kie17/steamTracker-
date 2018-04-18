var SteamCommunity = require('steamcommunity');
var SteamUser = require('steam-user')
var fx = require('money')
var oxr = require('open-exchange-rates')
var fs = require('fs');

oxr.set({ app_id: '2a83d1a7787c4493a71c6cb1e6039672' })

var community = new SteamCommunity();
var client = new SteamUser()
var user = null
var settings = null
var inventory = null
var walletBalance = null
var currencyList = {
	"0": "Invalid",
	"1": "USD",
	"2": "GBP",
	"3": "EUR",
	"4": "CHF",
	"5": "RUB",
	"6": "PLN",
	"7": "BRL",
	"8": "JPY",
	"9": "NOK",
	"10": "IDR",
	"11": "MYR",
	"12": "PHP",
	"13": "SGD",
	"14": "THB",
	"15": "VND",
	"16": "KRW",
	"17": "TRY",
	"18": "UAH",
	"19": "MXN",
	"20": "CAD",
	"21": "AUD",
	"22": "NZD",
	"23": "CNY",
	"24": "INR",
	"25": "CLP",
	"26": "PEN",
	"27": "COP",
	"28": "ZAR",
	"29": "HKD",
	"30": "TWD",
	"31": "SAR",
	"32": "AED",
	"34": "ARS",
	"35": "ILS",
	"36": "BYN",
	"37": "KZT",
	"38": "KWD",
	"39": "QAR",
	"40": "CRC",
	"41": "UYU",
	"42": "Max",}

module.exports = {

	updateCurrency: function(){
		oxr.latest(function() {
			fx.rates = oxr.rates;
			fx.base = oxr.base;
		});
	},

	getCommunity: function(){
		return community
	},

	getSteamUser: function(){
		return SteamUser
	},

	getClient: function(){
		return client
	},

	setUser: function(data){
		user = data
	},

	getUser: function(){
		return user
	},

	loadSettings:  function(){
		try{
			settings = JSON.parse(fs.readFileSync('settings.txt'));
			if (settings.restartTime < 5){
				console.log("restart time is set too low, please set it at a value above 5")
				process.exit()
			}
		}catch(err){
			console.log("formatting of the settings.txt is not in json, please fix it and try again")
			process.exit()
		}
	},

	getSettings: function(){
		return settings
	},

	setInventory: function(data){
		inventory = data
	},

	getInventory: function(){
		return inventory
	},

	sendChat :function(text){
		client.chatMessage(settings.secondayAccount,text)
	},

	getCurrency(value){
		return currencyList[client.wallet.currency.toString()]
	},

	convertValue(value){
		return fx(value).from('USD').to(currencyList[client.wallet.currency.toString()])
	},

	setBalance(value){
		walletBalance = value
	},
	
	getBalance(){
		return walletBalance
	}
}