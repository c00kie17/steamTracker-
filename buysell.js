var promise = require('promise')
var gbl = require('./global.js')

module.exports = {

	getBuyList :function(){
		itemBuyList = []
		settings = gbl.getSettings()
		return new promise(function(complete,reject){
			if (settings.trackbuyDuplicate){
				var inventory = gbl.getInventory()
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

	getSellList: function(settings,user){
		itemSellList = []
		settings = gbl.getSettings()
		inventory = gbl.getInventory()
		return new promise(function(complete,reject){		
			if (settings.allTradeble){
				for (var i = 0; i < inventory.length; i++) {
					if(inventory[i].marketable){
						data = {"name":inventory[i].market_hash_name,"change":settings.defaultSellChange,"appid":inventory[i].appid}
						itemSellList.push(data)
					}	
				}
				complete({"sell":itemSellList})
			}else{
				for(var game in settings.InventoryItems){
					for (var i = 0; i < settings.InventoryItems[game].length; i++) {
						var flag = true
						for (var j = 0; j < inventory.length; j++) {
							if(inventory[j].marketable){
								if(inventory[j].name == settings.InventoryItems[game][i].item|| inventory[j].market_name == settings.InventoryItems[game][i].item || inventory[j].market_hash_name == settings.InventoryItems[game][i].item){
									flag = false
									data = {"name":inventory[j].market_hash_name,"change":settings.InventoryItems[game][i].change,"appid":game}
									itemSellList.push(data)
								}
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
						if(inventory[i].marketable){
							if (trackList.includes(inventory[i].name)){
								data = {"name":inventory[i].market_hash_name,"change":settings.defaultSellChange,"appid":inventory[i].appid}
								itemSellList.push(data)
							}else{
								trackList.push(inventory[i].name)
							}
						}	
					}
				}
				complete({"sell":itemSellList})
			}			
		})
	},
	
}




