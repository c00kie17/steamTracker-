var promise = require('promise')
var ProgressBar = require('progress')
var gbl = require('./global.js')
var autotrader = require('./autotrader.js')

var bar = null
var lookback = new Date()


module.exports = {

	trackItem: function(buysellList){
		var buyCounter = 0
		var sellCounter = 0
		return new promise(function(complete,reject){
			totalVal = 0
			
			lookback = lookback.setDate(lookback.getDate()-gbl.getSettings().daymedian);
			for (var i = 0; i < buysellList.length; i++) {
				for(var transaction in buysellList[i]){
					totalVal = totalVal + buysellList[i][transaction].length
				}
			}
			bar = new ProgressBar( 'checking [:bar] :rate/bps :percent :etas', { total: totalVal });
			if (buysellList[0]['buy'].length > 0 || buysellList[0] != null){
				loopgetItem(buysellList,0,'buy',buyCounter)
			}
			if(buysellList[1]['sell'].length > 0 || buysellList[1] != null){
				loopgetItem(buysellList,1,'sell',sellCounter)
			}

			function loopgetItem(buysellList,i,transaction,counter){
				setTimeout(function () {  
					getItem(buysellList[i][transaction][counter].appid,buysellList[i][transaction][counter].name,transaction,buysellList[i][transaction][counter].change).then(function(value){
						calculateDiff(value.data,value.transaction,value.change)
					})
					counter++
					if (counter < buysellList[i][transaction].length){
						loopgetItem(buysellList,i,transaction,counter)
					} 
					if(bar.complete){
						complete()
					}
			   	}, 1000)
			}
		})
			
	},
	
}



function getItem(appid,name,transaction,change){
	return new promise(function(complete,reject){
		item = gbl.containsObj(name)
		if (item == false){
			gbl.getCommunity().getMarketItem(appid,name,function(err,item){
				if(err){
					getItem(appid,name,transaction,change)
				}
				gbl.addItemList(item)
				data = {"data":item,"transaction":transaction,"change":change}
				complete(data)	
			})
		}else{
			item.updatePrice(function(){
				data = {"data":item,"transaction":transaction,"change":change}
				complete(data)
			})
		}	
	})	
}



function calculateDiff(item,transaction,change){
	priceVal = 0
	points = 0
	currency = gbl.getCurrency()
	settings = gbl.getSettings()
	for (var i =0; i < item.medianSalePrices.length; i++) {
  		time = new Date(item.medianSalePrices[i].hour)
  		if (time.getTime() > lookback){
  			points++
  			priceVal = priceVal + item.medianSalePrices[i].price
  		}
	}
	averagePrice = priceVal/points
	change = (change*averagePrice)/100
	if (transaction == 'buy'){
		var buyPrice = null
		if (currency!= "USD"){
			buyPrice = gbl.convertValue(item.lowestPrice/100)
		}else{
			buyPrice = item.lowestPrice/100
		}
		if (buyPrice < settings.lowerbuyLimit){
			gbl.sendChat(item._hashName + " is lower than lower-limit at "+ buyPrice)
			if(settings.logtoConsole){
				console.log(item._hashName + " is lower than lower-limit at "+ buyPrice)
			}
			if(settings.autotrader){
				bar.tick()	
			}else{
				bar.tick()	
			}	
		}
		else if(buyPrice < (averagePrice-change)){
			var currentChange = ((buyPrice - averagePrice)*100)/averagePrice
            gbl.sendChat(item._hashName + " is "+Number(currentChange).toFixed(2)+"% lower than average at "+ Number(buyPrice).toFixed(2))  
            if(settings.logtoConsole){
            	console.log(item._hashName + " is "+Number(currentChange).toFixed(2)+"% lower than average at "+ Number(buyPrice).toFixed(2))  
            }
            if (settings.autotrader){
				bar.tick()	
			}else{
				bar.tick()	
			}           
		}else{
			bar.tick()
		}
	}

	if (transaction == 'sell'){
		var sellPrice = null
		if (currency!= "USD"){
	    	sellPrice = gbl.convertValue(item.highestBuyOrder/100) 
	    }else{
	    	sellPrice = item.highestBuyOrder/100
	    }

	    if(sellPrice > (averagePrice+change) && sellPrice > settings.lowersellLimit){
	        var currentChange = ((sellPrice - averagePrice)*100)/averagePrice
	        gbl.sendChat(item._hashName + " is "+Number(currentChange).toFixed(2)+"% higher than average at "+ Number(sellPrice).toFixed(2))
	        if(settings.logtoConsole){
	       		console.log(item._hashName + " is "+Number(currentChange).toFixed(2)+"% higher than average at "+ Number(sellPrice).toFixed(2)) 
	       	}
	       	if (settings.autotrader){
	       		if(item._hashName === "Carreau's Tradition"){
	       			autotrader.sellitem(item,Number(sellPrice).toFixed(2),function(){
	       				
						bar.tick()
					})
	       		}	
			}else{
				bar.tick()	
			}               
	    }else{
	    	bar.tick()
	    }
	}	
}







