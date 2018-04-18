# steamTracker-
used to track inventory and steam market Items

## Settings.txt
**the formatting of this file is in json.** 
- **currency** : (**_String_** )The currency that steam displays prices to you in and the currency you want to set all the setting values at.
- **secondayAccount** :  (**_String_** )The account id of any other steam account you have, this is used to send you notifications. You can get the steam id by going to that accounts profile page and copying it from the link.<img width="532" alt="screen shot 2018-04-17 at 5 41 25 pm" src="https://user-images.githubusercontent.com/10531093/38868956-9d6c2b38-4266-11e8-8748-86bf625fd122.png">
- **loop** : (**_Bool_**) if set to true will loop the script to run every **_restartTime_**
- **restartTime** : (**_int_**) the number of minutes after which you want the script to run again, minimum value for this flag is 5. needs **_loop_** to be set to true.
- **allTradeble** : (**_Bool_**) if true watches all tradable items your inventory.
- **tracksellDuplicate** : (**_Bool_**) if true watches all items that are have duplicates in your inventory. Does not work if **allTradeble** is set to true.
- **trackbuyDuplicate** : (**_Bool_**) if true removes item from **_trackItems_** if its already in your inventory.
- **daymedian** : (**_int_**) how many days it should look back to get a average price, higher the value lesser the change % that might get triggered
- **lowersellLimit**: (**_int_**) if an item is being watched and the asking price for it is lower than this value (in the specified currency) no notification is sent for its change.
- **lowerbuyLimit**: (**_int_**) if an item is being watched and the going price for it is lower than this value then no change calculation will be done, instead it will send a notification saying  "**item lower than lower-limit**"
- **defaultsellChange**: (**_int_**)  default change value given to every sell item whose change value is not specified 
- **defaultbuyChange**: (**_int_**)  default change value given to every buy item whose change value is not specified 
- **trackItems** : (**_dict_**) contains arrays of items you wanted to track with keys of these arrays set as game thier appid 
  - **appId**: (**_array_**) contains a array of dictionainies items you want to track for that game and thier change value, you can get the appid value [here](https://steamdb.info/apps/)
    - **_item_**: (**_String_** ) the hash name of the market item you want to track, you can get the the hash name from thier steam market page <img width="354" alt="screen shot 2018-04-17 at 6 09 09 pm" src="https://user-images.githubusercontent.com/10531093/38870123-767473ba-426a-11e8-8634-fd6151179545.png">
    - **_change_**: (**_int_**) is a % value of how much you +/- change from the average value you want to trigger a notification on.
    
- **InventoryItems**: (**_dict_**) contains arrays of items you wanted to track form your inventory, these items are added to your buy list. Holds the same format as **_trackItems_**
 
## How do I run this script? 
  - first thing youll need is **_node.js_** you can download it [here](https://nodejs.org/en/)
  - **optional**: you will also need **_git_** you can download it [here](https://git-scm.com/downloads)
  - next step is to download this repo, you can do that by opening _cmd_ on windows or _terminal_ on mac and running ``` git clone https://github.com/c00kie17/steamTracker- ``` if you did not download git you can click the **_Clone or download_** button on the top right corner of the page and download the repositiory
  - please set the settings for the script, you can read more about it above.
  - you can get into the folder by running ```cd steamTracker-/```
  - run ```npm install```  to install all depedencies 
  - you can run the script by running ```node main.js```
  - first time you run it it will ask you for your steam username, password and steamGuard, after that unless there is an error or the session expires you dont need to enter those details again.
 
    
