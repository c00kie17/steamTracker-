var yaml = require('js-yaml');
var fs = require('fs');
var promise = require('promise')
var login = require('./login.js')
var tracker = require('./tracker.js')
var settings = null


settings = JSON.parse(fs.readFileSync('settings.txt'));


module.exports = {


	getNormalBuyList :function(){
		itemBuyList = []
		return new promise(function(complete,reject){
			if (settings.trackbuyDuplicate){
				promiseList = []
				for(var game in settings.InventoryItems){
					promiseList.push(getInventory(game))
				}
				promise.all(promiseList).then(function(values){
					inventory = []
					for (var i = 0; i < values.length; i++) {
						for (var j = 0; j < values[i].length; j++) {
							inventory.push(values[i][j])
						}
					}
					for(var game in settings.trackItems){
						for (var i = 0; i < settings.trackItems[game].length; i++) {
							var flag = true
							for (var j = 0; j < inventory.length; j++) {
								if(settings.trackItems[game][i].item == inventory[j].market_hash_name){
									console.log("found item in inventory: "+inventory[j].market_hash_name)
									flag = false
								}
							}
							if(flag){
								data = {"name":settings.trackItems[game][i].item,"change":settings.trackItems[game][i].change,"appid":game}
					 			itemBuyList.push(data)
							}
						}	
					}
					complete({"buy":itemBuyList})
				})	
			}else{
				for(var game in settings.trackItems){
					for (var i = 0; i < settings.trackItems[game].length; i++) {
					 	data = {"name":settings.trackItems[game][i].item,"change":settings.trackItems[game][i].change,"appid":game}
					 	itemBuyList.push(data)
					} 
				}
				complete({"buy":itemBuyList})
			}
			
		})
	},

	getSellList: function(){
		itemSellList = []
		return new promise(function(complete,reject){
			promiseList = []
			for(var game in settings.InventoryItems){
				promiseList.push(getInventory(game))
			}
			promise.all(promiseList).then(function(values){
				inventory = []
				for (var i = 0; i < values.length; i++) {
					for (var j = 0; j < values[i].length; j++) {
						inventory.push(values[i][j])
					}
				}
				if (settings.allTradeble){
					for (var i = 0; i < inventory.length; i++) {
						data = {"name":inventory[i].market_hash_name,"change":settings.defaultSellChange,"appid":inventory[i].appid}
						itemSellList.push(data)
					}
					complete({"sell":itemSellList})
				}else{
					for(var game in settings.InventoryItems){
						for (var i = 0; i < settings.InventoryItems[game].length; i++) {
							var flag = true
							for (var j = 0; j < inventory.length; j++) {
								if(inventory[j].name == settings.InventoryItems[game][i].item|| inventory[j].market_name == settings.InventoryItems[game][i].item || inventory[j].market_hash_name == settings.InventoryItems[game][i].item){
									flag = false
									data = {"name":inventory[j].market_hash_name,"change":settings.InventoryItems[game][i].change,"appid":game}
									itemSellList.push(data)
								}
							}
							if(flag){
								console.log("item not in inventory: "+settings.InventoryItems[game][i].item)
							}
						}
					}
					if(settings.tracksellDuplicate){
						trackList = []
						for (var i = 0; i < inventory.length; i++) {
							if (trackList.includes(inventory[i].name)){
								data = {"name":inventory[i].market_hash_name,"change":settings.defaultSellChange,"appid":inventory[i].appid}
								itemSellList.push(data)
							}else{
								trackList.push(inventory[i].name)
							}
						}
						complete({"sell":itemSellList})
					}else{
						complete({"sell":itemSellList})
					}
				}
				
			})
		})
	},

	getSettings: function(){
		return settings
	}	
}

function getInventory(appid){
	return new promise(function(complete,reject){
		login.getUser().getInventoryContents(appid,2,true,function(err,inventory){
			if(err){
				reject(err)
			}else{
				complete(inventory)
			}
		})
	})
}


