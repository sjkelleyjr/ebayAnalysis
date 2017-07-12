var amazon      = require('amazon-product-api')
var ebay        = require('./ebayQueries/ebayQueries')
var ps4         = require('./itemParams/ps4/ps4')
var db          = require('./db');
var schedule    = require('node-schedule');
var pricePoints_used_fixed      = require('./models/pricePoints_Used_Fixed');
var items_used_fixed        = require('./models/items_Used_Fixed');


var getItems = function(callback){
    /* FINDING ITEMS CURRENTLY FOR SALE BELOW THIS AVERAGE */
    //check for new items every minute if this is fixed price code.
    pricePoints_used_fixed.findByKeyword('Playstation 4',function(documents){
        if(documents.length == 0){
            console.log('no price points for that keyword currently.');
            return;
        }
        //this should only return us 1 item, so we can hard code [0], i decided to query for all just in case
        //it becomes necessary later.
        ebay.findByKeyword(ps4.used_keyword_fixed,documents[0]['50percent'],documents[0]['40percent']
            ,documents[0]['30percent'],documents[0]['20percent'],documents[0]['10percent']
            ,documents[0]['100percent'],ps4.addedKeywordFilters,callback);
    })
}

var calcShipping = function(){
    /* CALCULATE SHIPPING FOR NECESSARY ITEMS */ 
    //calculate the shipping 1 minute after finding the items.
    items_used_fixed.findCalcShipping(function(items){
        if(items.length == 0){
            console.log('no items w calculated shipping');
        }
        for(var i = 0; i< items.length;i++){
            ebay.calcShipping(items[i]);
        }
    })
    return;
}


db.connect('MONGO_URL', function(err){
  if(err) {
    console.log('Unable to connect to Mongo')
    process.exit(1)
  } else {
    console.log('mongolab connection successful');
    /* GATHERING THE AVERAGE FOR THESE TYPE OF ITEM */
    //get price point once a day. (in this case, at 7:30)
    schedule.scheduleJob({hour:7,minute:30},function(){
        ebay.findCompletedKeyword(ps4.used_completed_fixed,90,340,ps4.addedKeywordFilters);
    })


    /* CHECK FOR PROFIT OF PAST ITEMS */ 
    //run this everyday.
    schedule.scheduleJob({hour:7,minute:40}, function(){
        items_used_fixed.getYesterdays(function(yItems){
            if(yItems.length == 0){
                console.log('no items from yesterday');
            }
            for(var i = 0; i< yItems.length;i++){
                ebay.getItem(yItems[i]);
            }
        }) 
    })

    // //fixed items get run every minute.
    setInterval(function(){
        getItems(function(){
            calcShipping();
        });
        console.log('*********************');
    },1*60*1000);
  }
})
