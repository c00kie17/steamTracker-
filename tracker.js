var login = require('./login.js')
var promise = require('promise')
var fx = require('money')
var oxr = require('open-exchange-rates')
var sleep = require('sleep');
var chat = require('./chat')
var fs = require('fs');
var ProgressBar = require('progress')


oxr.set({ app_id: '2a83d1a7787c4493a71c6cb1e6039672' })

var settings = JSON.parse(fs.readFileSync('settings.txt'));
var lookback = new Date()
lookback = lookback.setDate(lookback.getDate()-settings.daymedian);
var bar = null
var buyCounter = 0
var sellCounter = 0
promiseList = []

module.exports = {

	trackItem: function(buysellList){
		totalVal = 0
		
		for (var i = 0; i < buysellList.length; i++) {
			for(var transaction in buysellList[i]){
				totalVal = totalVal + buysellList[i][transaction].length
			}
		}
		bar = new ProgressBar( 'checking [:bar] :rate/bps :percent :etas', { total: totalVal });
		loopFunc(buysellList,0,'buy',buyCounter)
		loopFunc(buysellList,1,'sell',sellCounter)
	},

	updateCurrency: function(){
		oxr.latest(function() {
			fx.rates = oxr.rates;
			fx.base = oxr.base;
		});
	},

	getItem: function(appid,name,transaction,change){
		return new promise(function(complete,reject){
			login.getCommunity().getMarketItem(appid,name,function(err,item){
				if(err){
					module.exports.getItem(appid,name,transaction,change)
				}else{
					if (transaction == 0){
						complete(item)
					}else{
						data = {"data":item,"transaction":transaction,"change":change}
						complete(data)
					}		
				}
			})
		})	
	}
	
}

function loopFunc(buysellList,i,transaction,counter){
	setTimeout(function () {  
		bar.tick()
		module.exports.getItem(buysellList[i][transaction][counter].appid,buysellList[i][transaction][counter].name,transaction,buysellList[i][transaction][counter].change).then(function(value){
			calculateDiff(value.data,value.transaction,value.change)
		})
		counter++
		if (counter< buysellList[i][transaction].length){
			loopFunc(buysellList,i,transaction,counter)
		} 
		if (bar.complete) {
    		process.exit()
  		}  
   	}, 1000)
}

function calculateDiff(item,transaction,change){
	priceVal = 0
	points = 0
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
		buyPrice = fx(item.lowestPrice/100).from('USD').to(settings.currency)
		if (buyPrice < settings.lowercheck){
			//chat.sendChat(item._hashName + " is lower than lower-limit at "+ buyPrice)
			console.log(item._hashName + " is lower than lower-limit at "+ buyPrice)
		}else if(buyPrice < (averagePrice-change)){
			currentChange = ((buyPrice - averagePrice)*100)/averagePrice
            //chat.sendChat(item._hashName + " is "+Number(currentChange).toFixed(2)+"% lower than average at "+ buyPrice)  
            console.log(item._hashName + " is "+Number(currentChange).toFixed(2)+"% lower than average at "+ buyPrice)          
		}
	}
	if (transaction == 'sell'){
	    sellPrice = fx(item.highestBuyOrder/100).from('USD').to(settings.currency) 
	    if(sellPrice > (averagePrice+change) && sellPrice > setting.lowersellLimit){
	        currentChange = ((sellPrice - averagePrice)*100)/averagePrice
	        //chat.sendChat(item._hashName + " is "+Number(currentChange).toFixed(2)+"% higher than average at "+ sellPrice)
	        console.log(item._hashName + " is "+Number(currentChange).toFixed(2)+"% higher than average at "+ sellPrice)                
	    }
	}
}







