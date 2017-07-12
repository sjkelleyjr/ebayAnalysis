var ObjectId = require('mongodb').ObjectId
var assert = require('assert')
var db = require('../db')
var moment = require('moment')

exports.insert = function(item, callback) {
  var collection = db.get().collection('items_new_auction')
  collection.insert(item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the items_new_auction collection')
    console.log(item)
    callback(result)
  })
}


exports.findCalcShipping = function(callback){
  var collection = db.get().collection('items_new_auction');
  var cursor = collection.find({'calculateShipping': true}).toArray(function(err,items){
    callback(items);   
  })
}

exports.updateShippingCosts = function(item,callback){
  var collection = db.get().collection('items_new_auction')
  console.log(item);
  collection.update({'_id': item._id},{$set:{
    'shippingCost':item.shippingCost,
    'calculateShipping':false,
    'totalPrice':item.totalPrice,
    'pricePointCategory':item.pricePointCategory
  }}, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 items_used_auction document');
    console.log(item);
    callback(result);
  })
}


exports.find = function(id,callback){
  var collection = db.get().collection('items_new_auction')
  collection.findOne({'_id':id}, function(err, document) {
    assert.equal(err, null)
    console.log('Found 1 items_new_auction document')
    callback(document)
  })
}

exports.getAll = function(callback){
  var collection = db.get().collection('items_new_auction');
  var cursor = collection.find({}).toArray(function(err,items){
    callback(items);   
  })  
}


exports.getYesterdays = function(callback){
  var collection = db.get().collection('items_new_auction')
  var yesterday = moment().add(-1,'days');
  collection.find({'dateQueried':{
    '$gte': yesterday.toISOString(),
    '$lte': moment().toISOString()
  }}).toArray(function(err,items){
    callback(items);
  })
}

exports.getEnded = function(callback){
  var collection = db.get().collection('items_new_auction')
  var d = moment();
  collection.find({'dateEnded':{'$gte': d.toISOString()}}).toArray(function(err,items){
    callback(items);
  })
}

exports.remove = function(item,callback){
  var collection = db.get().collection('items_new_auction')
  collection.remove({'_id':item._id}, function(err, document) {
    assert.equal(err, null)
    if(document){
      console.log('Removed 1 items_new_auction document')
    }
    callback(document)
  })
}
exports.update = function(item,callback){
  var collection = db.get().collection('items_new_auction')
  collection.update({'_id': item._id},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 items_new_auction document');
    console.log(item);
    callback(result);
  })
}




exports.addTag = function(itemId,tag,callback){
  var collection = db.get().collection('items_new_auction') 
  collection.update(
    {'_id': itemId},
    { $addToSet: {tags: tag}}, 
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      // assert.equal(1, result.ops.length)
      console.log('pushed 1 tag to the items_new_auction')
      callback(result)
  })
}


exports.removeTag = function(itemId,tag,callback){
  var collection = db.get().collection('items_new_auction') 
  collection.update(
    {'_id': itemId},
    { $pull: {tags: tag}}, 
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      console.log('pushed 1 tag to the items_new_auction')
      callback(result)
  })
}