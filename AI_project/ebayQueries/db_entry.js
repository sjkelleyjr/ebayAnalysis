var items_new_auction       = require('../models/items_New_Auction');
var items_new_fixed         = require('../models/items_New_Fixed');
var items_used_auction      = require('../models/items_Used_Auction');
var items_used_fixed        = require('../models/items_Used_Fixed');
var pricePoints_New_Auction = require('../models/pricePoints_New_Auction');
var pricePoints_New_Fixed   = require('../models/pricePoints_New_Fixed');
var pricePoints_Used_Auction= require('../models/pricePoints_Used_Auction');
var pricePoints_Used_Fixed  = require('../models/pricePoints_Used_Fixed');
var profitDB                = require('../models/profit');







exports.enterItem = function(new_fixed,new_auction,used_fixed,used_auction,item){
	       if(new_fixed){
            item.ListingType = 'new_fixed';
            items_new_fixed.find(item._id,function(document){
              if(!document) {
                console.log('no item with currently with id' + item._id);
                items_new_fixed.insert(item,function(document){
                  if(!document) console.log('error inserting item '+ item.tite + ' to New Fixed db.')
                  // if(document) console.log(document);
                });
              }else{
                items_new_fixed.update(item,function(document){
                  if(!document) console.log('error updating item ' + item.title + ' to New Fixed db.')
                  if(document) console.log(item.title);
                });              
              }
            });
          }
          if(new_auction){
            item.ListingType = 'new_auction';
            items_new_auction.find(item._id,function(document){
              if(!document) {
                console.log('no item with currently with id' + item._id);
                items_new_auction.insert(item,function(document){
                  if(!document) console.log('error inserting item '+ item.tite + ' to Used Auction db.')
                  // if(document) console.log(document);
                });
              }else{
                items_new_auction.update(item,function(document){
                  if(!document) console.log('error updating item ' + item.title + ' to Used Auction db.')
                  if(document) console.log(item.title);
                });              
              }
            });
          }
          if(used_auction){
            item.ListingType = 'used_auction';
            items_used_auction.find(item._id,function(document){
              if(!document) {
                console.log('no item with currently with id' + item._id);
                items_used_auction.insert(item,function(document){
                  if(!document) console.log('error inserting item '+ item.tite + ' to Used Auction db.')
                  // if(document) console.log(document);
                });
              }else{
                items_used_auction.update(item,function(document){
                  if(!document) console.log('error updating item ' + item.title + ' to Used Auction db.')
                  if(document) console.log(item.title);
                });              
              }
            });
          }
          if(used_fixed){
            item.ListingType = 'used_fixed';
            items_used_fixed.find(item._id,function(document){
              if(!document) {
                console.log('no item with currently with id' + item._id);
                items_used_fixed.insert(item,function(document){
                  if(!document) console.log('error inserting item '+ item.tite + ' to Used Auction db.')
                  // if(document) console.log(document);
                });
              }else{
                items_used_fixed.update(item,function(document){
                  if(!document) console.log('error updating item ' + item.title + ' to Used Auction db.')
                  if(document) console.log(item.title);
                });              
              }
            });
          }
}


exports.enterPricePoint = function(new_fixed,new_auction,used_fixed,used_auction,ppJSON){
        if(new_fixed){
          pricePoints_New_Fixed.findByKeyword(ppJSON.keywords,function(document){
            if(document.length == 0) {
              console.log('no price point for keyword ' + ppJSON.keywords);
              pricePoints_New_Fixed.insert(ppJSON,function(document){
                if(!document) console.log('error inserting ppJSON to New Fixed db.')
                // if(document) console.log(document);
              });
            }else{
              pricePoints_New_Fixed.updateKeyword(ppJSON,function(document){
                if(!document) console.log('error updating ppJSON to New Fixed db.')
                if(document) console.log(ppJSON);
              });              
            }
          });

        }
        if(new_auction){
          pricePoints_New_Auction.findByKeyword(ppJSON.keywords,function(document){
            if(document.length == 0) {
              console.log('no price point for keyword ' + ppJSON.keywords);
              pricePoints_New_Auction.insert(ppJSON,function(document){
                if(!document) console.log('error inserting ppJSON to New Fixed db.')
                // if(document) console.log(document);
              });
            }else{
              pricePoints_New_Auction.updateKeyword(ppJSON,function(document){
                if(!document) console.log('error updating ppJSON to New Fixed db.')
                if(document) console.log(ppJSON);
              });              
            }
          });
        }
        if(used_auction){
          pricePoints_Used_Auction.findByKeyword(ppJSON.keywords,function(document){
            if(document.length == 0) {
              console.log('no price point for keyword ' + ppJSON.keywords);
              pricePoints_Used_Auction.insert(ppJSON,function(document){
                if(!document) console.log('error inserting ppJSON to New Fixed db.')
                // if(document) console.log(document);
              });
            }else{
              pricePoints_Used_Auction.updateKeyword(ppJSON,function(document){
                if(!document) console.log('error updating ppJSON to New Fixed db.')
                if(document) console.log(ppJSON);
              });              
            }
          });
        }
        if(used_fixed){
          pricePoints_Used_Fixed.findByKeyword(ppJSON.keywords,function(document){
            if(document.length == 0) {
              console.log('no price point for keyword ' + ppJSON.keywords);
              pricePoints_Used_Fixed.insert(ppJSON,function(document){
                if(!document) console.log('error inserting ppJSON to New Fixed db.')
                // if(document) console.log(document);
              });
            }else{
              pricePoints_Used_Fixed.updateKeyword(ppJSON,function(document){
                if(!document) console.log('error updating ppJSON to New Fixed db.')
                if(document) console.log(ppJSON);
              });              
            }
          });
        }
}

exports.enterProfit = function(item){
        profitDB.find(item,function(items){
          if(typeof(items) == 'undefined'){
            profitDB.insert(item,function(document){
              if(!document) console.log('error insterting into profit db');
            });
          }else{
             profitDB.update(item,function(document){
              if(!document) console.log('error updating in profit db');
            });           
          }
        }) 
}

exports.updateShipping = function(updatedShipping){
        if(updatedShipping.ListingType === 'new_fixed'){
          items_new_fixed.updateShippingCosts(updatedShipping,function(document){
            if(!document) console.log('error updating shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'new_auction'){
          items_new_auction.updateShippingCosts(updatedShipping,function(document){
            if(!document) console.log('error updating shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'used_auction'){
          items_used_auction.updateShippingCosts(updatedShipping,function(document){
            if(!document) console.log('error updating shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'used_fixed'){
          items_used_fixed.updateShippingCosts(updatedShipping,function(document){
            if(!document) console.log('error updating shipping costs for item ' + item.title );
          });
        }
}



exports.removeShippingItem = function(updatedShipping){
        if(updatedShipping.ListingType === 'new_fixed'){
          items_new_fixed.remove(updatedShipping,function(document){
            if(!document) console.log('error removing shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'new_auction'){
          items_new_auction.remove(updatedShipping,function(document){
            if(!document) console.log('error removing shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'used_auction'){
          items_used_auction.remove(updatedShipping,function(document){
            if(!document) console.log('error removing shipping costs for item ' + item.title );
          });
        }
        if(updatedShipping.ListingType === 'used_fixed'){
          items_used_fixed.remove(updatedShipping,function(document){
            if(!document) console.log('error removing shipping costs for item ' + item.title );
          });
        }
}