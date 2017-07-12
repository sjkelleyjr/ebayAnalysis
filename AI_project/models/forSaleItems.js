var ObjectId = require('mongodb').ObjectId
var assert = require('assert')
var db = require('../db')
var moment = require('moment')

exports.insert = function(item, callback) {
  var collection = db.get().collection('forSale')
  collection.insert(item, function(err, result) {
    // assert.equal(err, null)
    // assert.equal(1, result.result.n)
    // assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the forSale collection')
    console.log(item)
    callback(result)
  })
}


exports.findCalcShipping = function(callback){
  var collection = db.get().collection('forSale');
  var cursor = collection.find({'calculateShipping': true}).toArray(function(err,items){
    callback(items);   
  })
}

exports.updateShippingCosts = function(item,callback){
  var collection = db.get().collection('forSale')
  console.log(item);
  collection.update({'_id': item._id},{$set:{
    'shippingCost':item.shippingCost,
    'calculateShipping':false,
    'totalPrice':item.totalPrice,
    'pricePointCategory':item.pricePointCategory
  }}, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 forSale document');
    console.log(item);
    callback(result);
  })
}


exports.find = function(item,callback){
  var collection = db.get().collection('forSale')
  collection.findOne({'title':item.title}, function(err, document) {
    assert.equal(err, null)
    console.log('Found 1 forSale document')
    callback(document)
  })
}


exports.remove = function(item,callback){
  var collection = db.get().collection('forSale')
  collection.remove({'_id':item._id}, function(err, document) {
    assert.equal(err, null)
    if(document){
      console.log('Removed 1 forSale document')
    }
    callback(document)
  })
}


exports.removeOld = function(callback){
  //removing week old hot items.
  //this could be a day, we'll see about the functionality.
  var collection = db.get().collection('forSale')
  var d = moment().add(-1,'weeks');
  // console.log(d)
  // console.log(d.toISOString());
  collection.remove({'date':{'$lte': d.toISOString()}}, function(err, document) {
    assert.equal(err, null)
    callback(document)
  })
}


exports.update = function(item,callback){
  var collection = db.get().collection('forSale')
  collection.update({'title': item.title},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 forSale document');
    console.log(item);
    callback(result);
  })
}

