var ebay        = require('ebay-api');
var moment      = require('moment')
var fs          = require('fs');
var jsonfile    = require('jsonfile');
var items_new_auction       = require('../models/items_New_Auction');
var items_new_fixed         = require('../models/items_New_Fixed');
var items_used_auction      = require('../models/items_Used_Auction');
var items_used_fixed        = require('../models/items_Used_Fixed');
var pricePoints_New_Auction = require('../models/pricePoints_New_Auction');
var pricePoints_New_Fixed   = require('../models/pricePoints_New_Fixed');
var pricePoints_Used_Auction= require('../models/pricePoints_Used_Auction');
var pricePoints_Used_Fixed  = require('../models/pricePoints_Used_Fixed');
var hotCheapItems           = require('../models/hotCheapItems');
var profitDB                = require('../models/profit');
var dbEntry                 = require('./db_entry');




function printEbay(items, i,currentCost, shippingCost, totalCost){
  console.log('TITLE: ' + items[i].title);
  // console.log(items[i]);
  console.log('CURRENT PRICE: ' + currentCost);
  console.log('TIME LEFT: ' + items[i].sellingStatus.timeLeft);
  if(typeof(shippingCost) !== 'undefined'){
      console.log('SHIPPING COST: ' + shippingCost )
  }else{
    console.log('shipping calculated for this item');
  }
  console.log('TOTAL COST:' + totalCost);
  console.log('*********************************');
}

function printEbayBuyItNow(items, i,currentCost, shippingCost, totalCost){
  console.log('TITLE: ' + items[i].title);
  // console.log(items[i]);
  console.log('CURRENT PRICE: ' + currentCost);
  console.log('TIME LEFT: ' + items[i].sellingStatus.timeLeft);
    console.log('buyItNow?: ' + items[i].listingInfo.buyItNowAvailable);
  console.log('BUY IT NOW PRICE: ' + items[i].listingInfo.convertedBuyItNowPrice.amount);
  if(typeof(shippingCost) !== 'undefined'){
      console.log('SHIPPING COST: ' + shippingCost )
  }else{
    console.log('shipping calculated for this item');
  }
  console.log('TOTAL COST:' + totalCost);
  console.log('*********************************');
}



//candidate itemID's for purchasing
var Candidates = [];
// Candidates['50percent'] = [];
// Candidates['40percent'] = [];
// Candidates['30percent'] = [];
// Candidates['20percent'] = [];
// Candidates['10percent'] = [];



//pass in a word filter array here so we can also filter on words like 'controller' and shit
var ebay_findByKeyword = exports.findByKeyword = function(params, point5, point4, point3, point2, point1,marketVal,addedKeywordFilters,callback){
  var new_fixed = false;
  var new_auction = false;
  var used_auction = false;
  var used_fixed = false;
  //i'd like to get this in a function eventually, but that will entail some 
  //promises that I don't really want to get into right now.
  //this will have to happen above before throwing it into database.
  for(var i = 0 ; i< params.itemFilter.length;i++){
    if(params.itemFilter[i].name == 'Condition' && params.itemFilter[i+1].value == 'FixedPrice'){
      for(var j = 0 ;j < params.itemFilter[i].value.length;j++){
        if(params.itemFilter[i].value[j] == '1000'){
          new_fixed = true;
        }
        if(params.itemFilter[i].value[j] == '3000'){
            used_fixed = true;
        }
      }
    }
    if(params.itemFilter[i].name == 'Condition' && params.itemFilter[i+1].value == 'Auction'){
      for(var j = 0 ;j < params.itemFilter[i].value.length;j++){
        if(params.itemFilter[i].value[j] == '1000'){
          new_auction = true;
        }else if(params.itemFilter[i].value[j] == '3000'){
          used_auction = true;
        }
      }
    }
  }

  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
    params: params,
    parser: ebay.parseResponseJson    // (default)
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    console.log('FINDING ITEMS BY KEYWORD:');
    console.log('-------------------------');
    if (error) throw error;
    var curPage = Number(itemsResponse.paginationOutput.pageNumber);
    var totalPages = Number(itemsResponse.paginationOutput.totalPages);
    console.log("current page number: " + curPage);
    console.log('total pages: ' +  totalPages);
    if(totalPages == 0){
      console.log('no items with keyword ' + params.keywords);
      return;
    }
    if(curPage<=totalPages){
      var items = itemsResponse.searchResult.item;
      console.log('Found', items.length, 'items');
      for (var i = 0; i < items.length; i++) {
        var timeLeftString = items[i].sellingStatus.timeLeft;
        var dur_moment = moment.duration(timeLeftString)._data;
        var currCost = Number(items[i].sellingStatus.convertedCurrentPrice.amount);
        var itemTitle = items[i].title.toUpperCase();
        //some of these terms are ps4 specific though, we want to avoid that if at all possible.
        if(itemTitle.includes('BROKEN') ||itemTitle.includes('PARTS')||itemTitle.includes('PART')){
          //remove items that say 'broken' 'parts' or 'part'
          continue;
        }
        var titleFilter = false;
        //allow for variable keyword filtering.
        for(var j = 0;j < addedKeywordFilters.length;j++){
          if(itemTitle.includes(addedKeywordFilters[j])){
            // console.log('item contains a bad word');
            titleFilter = true;
            break;
          }
        }
        if(titleFilter){
          continue;
        }
        var item = {};
        item._id = items[i].itemId;
        item.title = items[i].title.toUpperCase();
        item.currentPrice = currCost;
        item.estimatedMarketValue = marketVal;
        //if the item has shipping pre-calculated
        if(typeof(items[i].shippingInfo.shippingServiceCost) !== 'undefined'){
          //get its cost to ship for total cost.
          var shippingCost = Number(items[i].shippingInfo.shippingServiceCost.amount);
          item.shippingCost = shippingCost;
          item.calculateShipping = false;
          item.totalPrice = shippingCost+currCost;
          //document when we queried this item.
          item.dateQueried = moment().toISOString();
        }else{
          //shipping is calculated for this item
          //currently we'll just set this to 25 until we figure it out.
          var shippingCost = 25;
          item.shippingCost = -1;
          item.calculateShipping = true;
          item.totalPrice = -1;
        }
        if(typeof(items[i].listingInfo.endTime) !== 'undefined'){
          //document when the auction ends.
          item.endDate = moment(items[i].listingInfo.endTime).toISOString();
        }
        var totalCost = shippingCost + currCost;
        // var fileString =  day + '_' + month + ' ' + hour + '_' + mins + '_' + secs;
        //check where this total cost falls into the profit margin spectrum.
        //only for items that are ending today.
        if(totalCost <= point5 && dur_moment.days == 0){
          //here we insert item into db.
          item.pricePointCategory = '50Percent';
          dbEntry.enterItem(new_fixed,new_auction,used_fixed,used_auction,item);
          // console.log(items[i]);
        }else if(totalCost > point5 && totalCost <= point4 && dur_moment.days == 0){
          item.pricePointCategory = '40Percent';
          dbEntry.enterItem(new_fixed,new_auction,used_fixed,used_auction,item);
          // console.log(items[i]);
        }else if(totalCost > point4 && totalCost <= point3 && dur_moment.days == 0){
          item.pricePointCategory = '30Percent';
          dbEntry.enterItem(new_fixed,new_auction,used_fixed,used_auction,item);
          // console.log(items[i]);
        }else if(totalCost > point3 && totalCost <= point2 && dur_moment.days == 0){
          item.pricePointCategory = '20Percent';          
          dbEntry.enterItem(new_fixed,new_auction,used_fixed,used_auction,item);
          // console.log(items[i]);
        }else if(totalCost > point2 && totalCost <= point1 && dur_moment.days == 0){
          item.pricePointCategory = '10Percent';  
          dbEntry.enterItem(new_fixed,new_auction,used_fixed,used_auction,item);  
          // console.log(items[i]);    
        }
      } 
      if(curPage == totalPages){
        //call the calculated shipping code.
        params.paginationInput.pageNumber = 1;
        callback();
        return;
      }
      //go to the next page.
      params.paginationInput.pageNumber = curPage+1;
      ebay_findByKeyword(params,point5,point4,point3,point2,point1,marketVal,addedKeywordFilters,callback);
    }
 
  });
}



exports.hotItems = function hotItems(params, filterVal){
      ebay.xmlRequest({
        'serviceName': 'Merchandising',
        'opType': 'getTopSellingProducts',
        'appId': 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
        params: {

        },
        parser: ebay.parseResponseJson    // (default)
      },
      // gets all the items together in a merged array
      function(error, data) {
        data.productRecommendations.product.forEach(function(product){
          var item = {};
          var averagePrice =Number((Number(product.priceRangeMax._)+Number(product.priceRangeMin._))/2);
          if(averagePrice < filterVal){
            item.priceRangeMin = Number(product.priceRangeMin._);
            item.priceRangeMax = Number(product.priceRangeMax._);
            item.title = product.title;
            item.date  = new Date().toISOString();
            console.log(item);
            hotCheapItems.find(item,function(document){
              if(!document){
                hotCheapItems.insert(item,function(document){
                  if(!document) console.log('error inserting new hot cheap item ' + item.title);
                  else{
                    console.log(item);
                  }
                })
              }else{
                hotCheapItems.update(item,function(document){
                  if(!document) console.log('error updating hot cheap item ' + item.title);
                  else{
                    console.log(item);
                  }
                })
              }
            })
          }
          // console.log(product);
          // console.log('------------------------------------------------------')
          // console.log();
        });
      });
}

exports.watchedItems = function watchedItems(){
      ebay.xmlRequest({
        'serviceName': 'Merchandising',
        'opType': 'getMostWatchedItems',
        'appId': 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
        params: {

        },
        parser: ebay.parseResponseJson    // (default)
      },
      // gets all the items together in a merged array
      function(error, data) {
        data.itemRecommendations.item.forEach(function(i){
          console.log(i);
        })
      });
}



exports.calcShipping = function getCalculatedShippingCost(item){
      //getting which database this data needs to go into right up front.
      console.log(item.ListingType);
      ebay.xmlRequest({
        'serviceName': 'Shopping',
        'opType': 'GetShippingCosts',
        'appId': 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
        params: {
          'ItemID':item._id,
          'DestinationCountryCode':'US',
          'DestinationPostalCode':'84341'
        },
        parser: ebay.parseResponseJson    // (default)
      },
      // gets all the items together in a merged array
      function(error, data) {
        console.log('GETTING SHIPPING DATA FOR ' + item._id + ' to Logan');
        console.log('-------------------------------------------------');
        var marketVal = item.estimatedMarketValue;
        var updatedShipping = {};
        updatedShipping._id = item._id;
        updatedShipping.ListingType = item.ListingType;
        updatedShipping.shippingCost = Number(data.ShippingCostSummary.ShippingServiceCost.amount);
        updatedShipping.totalPrice = item.currentPrice + updatedShipping.shippingCost;
        if(updatedShipping.totalPrice < (marketVal-marketVal*.5)){
          updatedShipping.pricePointCategory = '50percent';
          dbEntry.updateShipping(updatedShipping);
        }else if(updatedShipping.totalPrice < (marketVal-marketVal*.4)){
          updatedShipping.pricePointCategory = '40percent';
          dbEntry.updateShipping(updatedShipping);
        }else if(updatedShipping.totalPrice < (marketVal-marketVal*.3)){
          updatedShipping.pricePointCategory = '30percent';
          dbEntry.updateShipping(updatedShipping);
        }else if(updatedShipping.totalPrice < (marketVal-marketVal*.2)){
          updatedShipping.pricePointCategory = '20percent';
          dbEntry.updateShipping(updatedShipping);
        }else if(updatedShipping.totalPrice < (marketVal-marketVal*.1)){
          updatedShipping.pricePointCategory = '10percent';
          dbEntry.updateShipping(updatedShipping);
        }else{
          //delete the item it's now out of our price range.
          dbEntry.removeShippingItem(updatedShipping);
        }
        // console.log(updatedShipping);
        // return Number(data.ShippingCostSummary.ShippingServiceCost.amount)
      });
}






var ebay_getItem = exports.getItem = function(item){
    ebay.xmlRequest({
      'serviceName': 'Shopping',
      'opType': 'GetSingleItem',
      'appId': 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
      params: {
        ItemID: item._id,
        IncludeItemSpecifics: true
      },
      parser: ebay.parseResponseJson    // (default)
    },
    // gets all the items together in a merged array
    function itemsCallback(error, data) {
      console.log('FINDING ITEM ' + item._id + ' (' + item.title + '):');
      console.log('----------------------------------');
      if (error){
        console.log('error retrieving item data');
        console.log(error);
      } 
      if(data.Item.ListingStatus == 'Completed'){
        if(typeof(data.Item.ConditionDescription) !== 'undefined'){
          var ConditionString = data.Item.ConditionDescription;
          //in the future this will be an array of bad words we'll just loop through and check them all
          //instead of hard coding them in like this
          if(ConditionString.toUpperCase().includes('SCRATCHES') ||ConditionString.toUpperCase().includes('SCUFFS')||ConditionString.toUpperCase().includes('DENTS')||
            ConditionString.toUpperCase().includes('CLEAN') || ConditionString.toUpperCase().includes('CLEANING') || ConditionString.toUpperCase().includes('DAMAGE')||
            ConditionString.toUpperCase().includes('DAMAGED') || ConditionString.toUpperCase().includes('SCRATCHING')|| ConditionString.toUpperCase().includes('WEAR')||
            ConditionString.toUpperCase().includes('CLEANED')){
            console.log('ignore these items, they have problems...');
            return;
          }

        }else{
          console.log('condition description is undefined..');
        }
        //we need a profit margin filter here, where we only actually purchase good deals
        //otherwise we'll just keep purchasing at the average price.
        var soldPrice = Number(data.Item.ConvertedCurrentPrice.amount);
        //changing the data to test database entry.
        var totalCost = soldPrice + item.shippingCost;
        console.log('item sold for totalCost ' + totalCost);
        console.log('the items estimatedMarketValue is ' + item.estimatedMarketValue);




        //THIS IS WHERE WE PURCHASE ITEMS!
        if(totalCost <  (item.estimatedMarketValue-.5*item.estimatedMarketValue)){
          //cleaning up the data in the profit database a bit.
          delete item.currentPrice;
          delete item.shippingCost;
          delete item.calculateShipping;
          delete item.totalPrice
          delete item.dateQueried
          item.endingPrice = totalCost;
          item.profit     = item.estimatedMarketValue - totalCost;
          item.pricePointCategory = '50percent';
          item.endDate = data.Item.EndTime;
          item.datePurchased = moment().toISOString();
          dbEntry.enterProfit(item);
        }else if(totalCost <  (item.estimatedMarketValue-.4*item.estimatedMarketValue)){
          delete item.currentPrice;
          delete item.shippingCost;
          delete item.calculateShipping;
          delete item.totalPrice
          delete item.dateQueried
          item.endingPrice = totalCost;
          item.profit     = item.estimatedMarketValue - totalCost;
          item.pricePointCategory = '40percent';
          item.endDate = data.Item.EndTime;
          item.datePurchased = moment().toISOString();
          dbEntry.enterProfit(item);
        }else if(totalCost <  (item.estimatedMarketValue-.3*item.estimatedMarketValue)){
          delete item.currentPrice;
          delete item.shippingCost;
          delete item.calculateShipping;
          delete item.totalPrice
          delete item.dateQueried
          item.endingPrice = totalCost;
          item.profit     = item.estimatedMarketValue - totalCost;
          item.pricePointCategory = '30percent';
          item.endDate = data.Item.EndTime;
          item.datePurchased = moment().toISOString();
          dbEntry.enterProfit(item);
        }else if(totalCost <  (item.estimatedMarketValue-.2*item.estimatedMarketValue)){
          delete item.currentPrice;
          delete item.shippingCost;
          delete item.calculateShipping;
          delete item.totalPrice
          delete item.dateQueried
          item.endingPrice = totalCost;
          item.profit     = item.estimatedMarketValue - totalCost;
          item.pricePointCategory = '20percent';
          item.endDate = data.Item.EndTime;
          item.datePurchased = moment().toISOString();
          dbEntry.enterProfit(item);
        }else if(totalCost <  (item.estimatedMarketValue-.1*item.estimatedMarketValue)){
          delete item.currentPrice;
          delete item.shippingCost;
          delete item.calculateShipping;
          delete item.totalPrice
          delete item.dateQueried
          item.endingPrice = totalCost;
          item.profit     = item.estimatedMarketValue - totalCost;
          item.pricePointCategory = '10percent';
          item.endDate = data.Item.EndTime;
          item.datePurchased = moment().toISOString();
          dbEntry.enterProfit(item);
        }else if(totalCost < item.estimatedMarketValue){
          console.log('item is less than average, but not enough to purchase.');
        }else{
          console.log('item is higher than average')
        }
      }else{
        console.log('item still for sale....');
      }
    });
}





var totalPrice = 0;
var wShipping = 0;
var goodItemCount = 0;
var average = 0;
var pricePoint = 0;


var ebay_findCompletedKeyword = exports.findCompletedKeyword = function(params, lowerFilter, upperFilter, addedKeywordFilters){
  //getting which database this data needs to go into right up front.
  var new_fixed = false;
  var new_auction = false;
  var used_auction = false;
  var used_fixed = false;
  for(var i = 0 ; i< params.itemFilter.length;i++){
    if(params.itemFilter[i].name == 'Condition' && params.itemFilter[i+1].value == 'FixedPrice'){
      for(var j = 0 ;j < params.itemFilter[i].value.length;j++){
        if(params.itemFilter[i].value[j] == '1000'){
          new_fixed = true;
        }
        if(params.itemFilter[i].value[j] == '3000'){
            used_fixed = true;
        }
      }
    }
    if(params.itemFilter[i].name == 'Condition' && params.itemFilter[i+1].value == 'Auction'){
      for(var j = 0 ;j < params.itemFilter[i].value.length;j++){
        if(params.itemFilter[i].value[j] == '1000'){
          new_auction = true;
        }else if(params.itemFilter[i].value[j] == '3000'){
          used_auction = true;
        }
      }
    }
  }
  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findCompletedItems',
    appId: 'APP_ID_HERE',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
    params: params,
    parser: ebay.parseResponseJson    // (default)
  },
  // gets all the items together in a merged array
  function itemsCallback(error, itemsResponse) {
    console.log('FINDING COMPLETED ITEMS BY KEYWORD:');
    console.log('----------------------------------');
    if (error) throw error;
    var curPage = Number(itemsResponse.paginationOutput.pageNumber);
    var totalPages = Number(itemsResponse.paginationOutput.totalPages);
    console.log("current page number: " + curPage);
    console.log('total pages: ' +  totalPages);
    if(totalPages == 0){
      console.log('no completed sales for this keyword...');
      return;
    }
    if(curPage<=totalPages){
      var items = itemsResponse.searchResult.item;

      console.log('Found', items.length, ' completed items w/ keyword/s \"' + params.keywords + '\"'); 
      //sum the prices and average over items.length
      for (var i = 0; i < items.length; i++) {
        var itemTitle = items[i].title.toUpperCase();
        if(itemTitle.includes('BROKEN') ||itemTitle.includes('PARTS')||itemTitle.includes('PART')){
         //remove items that say 'broken' 'parts' or 'part'
          continue;
        }
        var titleFilter = false;
        //allow for variable keyword filtering.
        for(var j = 0;j < addedKeywordFilters.length;j++){
          if(itemTitle.includes(addedKeywordFilters[j])){
            // console.log('item contains a bad word');
            titleFilter = true;
            break;
          }
        }
        if(titleFilter){
          continue;
        }
        var listType = items[i].listingInfo.listingType
        var price = items[i].sellingStatus.convertedCurrentPrice.amount;
        var shipping = 0;
        if(typeof(items[i].shippingInfo.shippingServiceCost) !== 'undefined'){
          //we can actually retrieve a shipping price.
          shipping = items[i].shippingInfo.shippingServiceCost.amount
        }else{
          //we need to estimate shipping
          shipping = 25;
        }
        //we need to figure out a technique for cutting out these as well.
        if((price+shipping) > upperFilter){
          if((price+shipping) < upperFilter+30){
            console.log('upper filtered variables');
            console.log(items[i].title);
            console.log(price+shipping);
          }
        //create a relatively high cutoff for the first filter,
        //then filter much lower than that and print out the items, If the majority of the items
        //you see are in this second filter then that's a good price.
        }else if((price+shipping) < lowerFilter){
          if((price+shipping) > lowerFilter-30){
            console.log('these are cutoff items');
            console.log(items[i].title);
            console.log(items[i].itemId)
            console.log(price+shipping);

          }
        }else{
          totalPrice += price;
          goodItemCount = goodItemCount+1;
          wShipping += shipping;
        }
      }

      if(curPage == totalPages){
        // console.log('TOTAL PRICE SOLD: ' + totalPrice);
        // console.log('TOTAL SHIPPING COSTS: ' + wShipping);
        // console.log('total number of good items: ' + goodItemCount);
        // console.log('AVERAGE PRICE:' + totalPrice/goodItemCount);
        // console.log('W/SHIPPING: ' + (totalPrice+wShipping)/goodItemCount); 
        average = (totalPrice+wShipping)/goodItemCount;
        var ppJSON = {};
        ppJSON['50percent'] = average - .5*average;
        ppJSON['40percent'] = average - .4*average;
        ppJSON['30percent'] = average - .3*average;
        ppJSON['20percent'] = average - .2*average;
        ppJSON['10percent'] = average - .1*average;
        ppJSON['100percent'] = average;
        ppJSON['upperFilter'] = upperFilter;
        ppJSON['lowerFilter'] = lowerFilter;
        ppJSON['keywords'] = params.keywords;
        console.log(ppJSON);
        params.paginationInput.pageNumber = 1;
        // console.log(ppJSON);
        // console.log('writing daily average: ' + ppJSON['1'] +' to database');
        //based on which type of query this is insert it into the appropriate collection.
        dbEntry.enterPricePoint(new_fixed,new_auction,used_fixed,used_auction,ppJSON);
        return;
      }
      //go to the next page.
      params.paginationInput.pageNumber = curPage+1;
      ebay_findCompletedKeyword(params,lowerFilter,upperFilter,addedKeywordFilters);
    }
  });
}


// var ebay_getTotals = exports.ebay_getTotals = function(){
//     console.log('TOTAL PRICE SOLD: ' + totalPrice);
//     console.log('TOTAL SHIPPING COSTS: ' + wShipping);
//     console.log('total number of good items: ' + goodItemCount);
// }

// var ebay_getAverage = exports.ebay_getAverage = function(){
//     console.log('AVERAGE PRICE:' + totalPrice/goodItemCount);
//     console.log('W/SHIPPING: ' + (totalPrice+wShipping)/goodItemCount); 
//     average = (totalPrice+wShipping)/goodItemCount;
// }

// var ebay_createPricePoint = exports.ebay_createPricePoint = function(profitPercentage){
//     pricePoint = average - profitPercentage*average;
//     console.log('pricePoint for this item is: ' + pricePoint);
//     return pricePoint;
// }
