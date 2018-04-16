var yaml = require('js-yaml');
var fs = require('fs');
var promise = require('promise')
var login = require('./login.js')
var tracker = require('./tracker.js')
var settings = null


settings = JSON.parse(fs.readFileSync('settings.txt'));


module.exports = {

	//not being used at the moment
	getSearchBuyList: function(){
		itemBuyList = []
		return new promise(function(complete,reject){
			promiseList = []
			for(var game in settings.trackItems){
				for(var i=0; i< settings.trackItems[game].length; i++) {
					promiseList.push(serachItemList(settings.trackItems[game][i].item,game,settings.trackItems[game][i].change))
				}
			}
			promise.all(promiseList).then(function(values){
				for (var i = 0; i < values.length; i++) {
					for (var j = 0; j < values[i].length; j++) {
						itemBuyList.push(values[i][j])
					}
				}
				complete({"buy":itemBuyList})
			})
		})
	},

	getNormalBuyList :function(){
		itemBuyList = []
		return new promise(function(complete,reject){
			for(var game in settings.trackItems){
				for (var i = 0; i < settings.trackItems[game].length; i++) {
				 	data = {"name":settings.trackItems[game][i].item,"change":settings.trackItems[game][i].change,"appid":game}
				 	itemBuyList.push(data)
				} 
			}
			complete({"buy":itemBuyList})
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
						data = {"name":inventory[i].market_hash_name,"change":settings.allTradebleChange,"appid":inventory[i].appid}
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
					if(settings.trackDuplicate){
						//do the duplicate code Pale Augur will be available to test on 21st
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


//not being used at the moment 
function serachItemList(searchTerm,appid,change){
	return new promise(function(complete,reject){
		login.getCommunity().marketSearch({
			"query":searchTerm,
			"appid":appid,
			"searchDescriptions":false
		},function(err,items){
			if (err){
				if (err == "Error: There were no items matching your search. Try again with different keywords."){
					console.log("there is not listing for: "+searchTerm)
				}else{
					console.log(err)
				}
			}else{
				promiseList = []
				items.forEach(function(value){
					promiseList.push(tracker.getItem(appid,value.market_hash_name,0))
				})

				promise.all(promiseList).then(function(values){
					searchList = []
					item = null
					for (var i = 0; i < values.length; i++) {
						if (item == null || values[i].lowestPrice < item.lowestPrice){
							item = values[i]
						}
					}	
					data = {"name":item._hashName,"change":change,"appid":appid}
					searchList.push(data)
					complete(searchList)
				})
				
				
			}	
		})
	})
}