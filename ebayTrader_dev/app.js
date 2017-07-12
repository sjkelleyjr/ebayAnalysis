var amazon      = require('amazon-product-api')
var ebay        = require('./ebayQueries/ebayQueries')
var ps4         = require('./itemParams/ps4/ps4')
var iphone_unlocked = require('./itemParams/iphone/iphone')
var db          = require('./db');
var pricePoints_new_fixed       = require('./models/pricePoints_New_Fixed');
var pricePoints_new_auction     = require('./models/pricePoints_New_Auction');
var pricePoints_used_fixed      = require('./models/pricePoints_Used_Fixed');
var pricePoints_used_auction    = require('./models/pricePoints_Used_Auction');
var items_new_auction       = require('./models/items_New_Auction');
var items_new_fixed         = require('./models/items_New_Fixed');
var items_used_auction      = require('./models/items_Used_Auction');
var items_used_fixed        = require('./models/items_Used_Fixed');
var hotCheapItems           = require('./models/hotCheapItems');


//middlewares
// app.set('view engine', 'jade')
// app.use(express.static(path.join(__dirname,'public')));
// app.use(bodyParser.urlencoded({extended: false}))
// app.use(session({
//   cookieName: 'session',
//   secret: 'lksdgfiertmf',
//   resave: false,
//   saveUnitialized: true,
// }))


var getItems = function(callback){
    /* FINDING ITEMS CURRENTLY FOR SALE BELOW THIS AVERAGE */
    //check for new items every minute if this is fixed price code.
    pricePoints_used_auction.findByKeyword('Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone',function(documents){
        if(documents.length == 0){
            console.log('no price points for that keyword currently.');
            return;
        }
        //this should only return us 1 item, so we can hard code [0], i decided to query for all just in case
        //it becomes necessary later.
        ebay.findByKeyword(iphone_unlocked.used_keyword_auction,documents[0]['50percent'],documents[0]['40percent']
            ,documents[0]['30percent'],documents[0]['20percent'],documents[0]['10percent']
            ,documents[0]['100percent'],iphone_unlocked.addedKeywordFilters,callback);
    })
}

var calcShipping = function(){
    /* CALCULATE SHIPPING FOR NECESSARY ITEMS */ 
    //calculate the shipping 1 minute after finding the items.
    items_used_auction.findCalcShipping(function(items){
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
    // pricePoints_new_fixed.insert({'Test':1234},function(document){
    //     console.log(document);
    // });
    //write all the querying code in here.
    //MAIN FUNCTIONS:
    //****DONE****1. daily query of average prices, run at system time "X" everyday and stored in a collection
    //PricePoints Used_Auction
    //PricePoints New_Auction
    //PricePoints New_Fixed
    //PricePoints Used_Fixed
    //with objects {keywords:['Playstation 4','Playstation4'], upperFilter: 200, lowerFilter: 100, average:260.8593454345416,.5:130.4296727172708,
    //.4:156.51560726072495,.3:182.6015418041791,.2:208.68747634763326,.1:234.77341089108742 }
    //eventually it would be nice to take the old mean and use it to calculate the variance and std dev while
    //computing the new mean everyday. EVENTUALLY....
    // ebay.findCompletedKeyword(iphone_unlocked.used_completed_fixed,0,1000,iphone_unlocked.addedKeywordFilters);

    //2. get target items using the available price point for each keyword, auctioned ones, once a day at a system time,
    //fixed price as often as possible
    //objects will look like:
    //{_id: <THIS IS THE ITEM ID FROM EBAY, title: "GAME GAME GAME" calculateShipping: true, 
    // currentPrice: 100, shippingCost: -1, totalPrice: 120,estimatedMarketValue: 270.234234, pricePointCategory: '50percent',
    //timeLeft: <some kind of momentjs parsable date object>, 
    // dateQueried: <some kind of momentjs parsable date object> 
    //MORE SHIT I DEEM NECESSARY WILL BE IN THIS OBJECT}
    // pricePoints_new_auction.findByKeyword('Playstation 4',function(documents){
    //     if(documents.length == 0){
    //         console.log('no price points for that keyword currently.');
    //         return;
    //     }
    //     //this should only return us 1 item, so we can hard code [0], i decided to query for all just in case
    //     //it becomes necessary later.
    //     ebay.findByKeyword(ps4.new_keyword_auction,documents[0]['50percent'],documents[0]['40percent']
    //         ,documents[0]['30percent'],documents[0]['20percent'],documents[0]['10percent'],documents[0]['100percent'],ps4.addedKeywordFilters);
    // })
    
    //3. get the calculated shipping for items that need it immediately after this (it will be the items with calculatedShipping == true)
    //if the calculated shipping puts these items out of our price range, remove them from the database. 
    // items_new_auction.findCalcShipping(function(items){
    //     console.log('calculating shipping for items:');
    //     console.log(items);
    //     for(var i = 0; i< items.length;i++){
    //         ebay.calcShipping(items[i]);
    //     }
    // })

    
    //4. run the profit margin code
    // and store potential profits in the profits collection
    //with object {Date:<some kind of recognized date time stamp>, marketPrice: 262.90439306358377,
    //purchasedPrice: 244, itemTitle: "PLAYSTATION 4 BRAND NEW", itemID: 2344543524534
    //listingType: FixedPrice, Condition: <used or new>}
    //NOTE: eventually number 4 will be a purchasing algorithm, this can be developed during the month of testing
    //to see the viability of the algorithm
    getItems(function(){
        calcShipping();
    });
    console.log('*********************');



    // items_new_auction.getYesterdays(function(yItems){
    //     if(yItems.length == 0){
    //         console.log('no items from yesterday');
    //     }
    //     for(var i = 0; i< yItems.length;i++){
    //         ebay.getItem(yItems[i]);
    //     }
    // })
  }
})
