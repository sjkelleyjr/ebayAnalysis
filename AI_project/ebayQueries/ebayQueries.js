var ebay        = require('ebay-api');
var moment      = require('moment')
var fs          = require('fs');
var jsonfile    = require('jsonfile');
var completedItems          = require('../models/completedItems');
var forSaleItems          = require('../models/forSaleItems');
var dbEntry                 = require('./db_entry');


//pass in a word filter array here so we can also filter on words like 'controller' and shit
var ebay_findByKeyword = exports.findByKeyword = function(params,addedKeywordFilters,callback){
  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findItemsByKeywords',
    appId: 'APP_ID_HERE'      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
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
        // item.estimatedMarketValue = marketVal;
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
        //does day of week effect price?
        if(typeof(items[i].listingInfo.endTime) !== 'undefined'){
          //document when the auction ends.
          item.endDate = moment(items[i].listingInfo.endTime).toISOString();
        }
        var totalCost = shippingCost + currCost;
        // console.log(items[i]);
        //ONLY STORE ITEMS FOR CLASSIFICATION THAT HAVE A DAY LEFT
        if(dur_moment.days <= 1){
          //console.log(items[i]);
           item.location = items[i].location
           item.country  = items[i].country
           item.bidCount = Number(items[i].sellingStatus.bidCount);
           item.listingType = items[i].listingInfo.listingType;
           item.bestOffer = items[i].listingInfo.bestOfferEnabled;
           item.buyItNowAvailable = items[i].listingInfo.buyItNowAvailable;
           item.conditionId = items[i].condition.conditionId
           item.conditionDisplayName = items[i].condition.conditionDisplayName;
           item.timeLeft = dur_moment;
           console.log(item);
           //forSaleItems.insert(item,function(document){
           //    if(!document){
           //      console.log("Error inserting the completed item");
           //    }
           //})
        }
        //INSERT ITEMS INTO DB HERE!
        // var fileString =  day + '_' + month + ' ' + hour + '_' + mins + '_' + secs;
        //check where this total cost falls into the profit margin spectrum.
        //only for items that are ending today.
      } 
      if(curPage == totalPages){
        //write to the database here.
        params.paginationInput.pageNumber = 1;
        callback();
        return;
      }
      //go to the next page.
      params.paginationInput.pageNumber = curPage+1;
      ebay_findByKeyword(params,addedKeywordFilters,callback);
    }
 
  });
}


var totalPrice = 0;
var wShipping = 0;
var goodItemCount = 0;
var average = 0;
var pricePoint = 0;



//all we really care about here is the itemId and the price, no?
var ebay_findCompletedKeyword = exports.findCompletedKeyword = function(params, lowerFilter, upperFilter, addedKeywordFilters){
  ebay.xmlRequest({
    serviceName: 'Finding',
    opType: 'findCompletedItems',
    appId: 'APP_ID_HERE'      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
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
        if(price > upperFilter){
          if(price < upperFilter+30){
            // console.log('upper filtered variables');
            // console.log(items[i].title);
            // console.log(price+shipping);
          }
        //create a relatively high cutoff for the first filter,
        //then filter much lower than that and print out the items, If the majority of the items
        //you see are in this second filter then that's a good price.
        }else if(price < lowerFilter){
          if(price > lowerFilter-30){
            // console.log('these are cutoff items');
            // console.log(items[i].title);
            // console.log(items[i].itemId)
            // console.log(price+shipping);

          }
        }else{
          totalPrice += price;
          goodItemCount = goodItemCount+1;
          wShipping += shipping;
          // console.log(items[i])
          var completedItemJSON = {}
          completedItemJSON['_id'] = items[i].itemId; 
          completedItemJSON['categoryId'] = items[i].primaryCategory.categoryId
          completedItemJSON['categoryName'] = items[i].primaryCategory.categoryName;
          completedItemJSON['sellingPrice'] = items[i].sellingStatus.convertedCurrentPrice.amount + shipping;
          //put this in the database.
          console.log(completedItemJSON);
          //completedItems.insert(completedItemJSON,function(document){
          //    if(!document){
          //      console.log("Error inserting the completed item");
          //    }
          //});
        }

      }
      //go to the next page.
      params.paginationInput.pageNumber = curPage+1;
      ebay_findCompletedKeyword(params,lowerFilter,upperFilter,addedKeywordFilters);
    }
  });
}
