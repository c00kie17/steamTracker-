var login = require('./login.js')
var gbl = require('./global.js')

gbl.loadSettings()
login.performLogin()

//autotrade
//getItem refresh instead of fetch 
//every 5 hours fetch all items again
//add checker to see if all  importtant fields in settings have been filled
//loop 2 failing


 











