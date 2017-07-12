var express     = require('express')
var path        = require('path')
var port        = 8000
var request     = require('request')
var bodyParser  = require('body-parser')
var jade        = require('jade')
var session		  = require('express-session')
var moment      = require('moment')
var amazon      = require('amazon-product-api')
var waterfall   = require('async-waterfall')
var ebayFuncs   = require('./ebayQueries/ebayQueries')
var jsonfile    = require('jsonfile');
var params      = require('./ebayQueries/params')
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


var app = express();


//////////here is were we should get the calculated shipping prices for items in our candidate items list
// 3.
// THIS IS WHERE WE GET THE PROFIT MARGINS!
// jsonfile.readFile('candidate_items_18_7 20_58_4.json', function(err,obj){
//   if(err) console.log(err);

//   //read in the json objects, query the items.  If they are unsold, see what the unsold price was
//   //this is the price we could have bought it for.  If it is below market value take the difference
//   //between the unsold price and market value as profit.
//   for(var key in obj){
//     if(obj[key].length <= 0){
//       // the array is empty
//       continue;
//     }else{
//       for(var i = 0; i < obj[key].length;i ++){
//         // console.log(obj[key][i]);
//         ebayFuncs.ebay_getItem(obj[key][i],obj['1']);
//       }
//     }
//   }

//   //if it did sell, ignore it as we might have been outbid?
//   //or see if it was within our profit margin price, if it was take the difference between this margin price
//   //and the market value as profit.
// });

//use these functions to see what people are interested in buying.
// ebayFuncs.ebay_hotItems(params.hot_items);
// ebayFuncs.ebay_watchedItems();


// app.listen(port,function(){
// 	console.log('Listening on ' + port);
// })


db.connect('MONGO_URL', function(err){
  if(err) {
    console.log('Unable to connect to Mongo')
    process.exit(1)
  } else {
    console.log('mongolab connection successful');
    //running every minute
    setInterval(function(){
        console.log('finding the hotest items under 25');
        ebayFuncs.ebay_hotItems(null,25);
    }, 60*10*10*10);
    //running every 24 hours
    setInterval(function(){
        console.log('removing week old items');
        hotCheapItems.removeOld(function(document){
            if(!document){
                console.log('error removing old items');
            }else{
                console.log('removed day old items');
            }
        });
    }, 24*60*60*10*10*10);

  }
})
