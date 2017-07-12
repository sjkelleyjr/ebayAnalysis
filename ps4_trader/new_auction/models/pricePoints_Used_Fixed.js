var ObjectId = require('mongodb').ObjectId
var assert = require('assert')
var db = require('../db')

exports.insert = function(item, callback) {
  console.log('does this shit at least run??');
  var collection = db.get().collection('pricePoints_used_fixed')
  collection.insert(item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    assert.equal(1, result.ops.length)
    console.log('Inserted 1 document into the pricePoints_used_fixed collection')
    console.log(item)
    callback(result)
  })
}



exports.find = function(id,callback){
  var collection = db.get().collection('pricePoints_used_fixed')
  collection.findOne({'_id':id}, function(err, document) {
    assert.equal(err, null)
    console.log('Found 1 pricePoints_used_fixed document')
    callback(document)
  })
}

exports.findByKeyword = function(keyword,callback){
  var collection = db.get().collection('pricePoints_used_fixed');
  var cursor = collection.find({'keywords': keyword}).toArray(function(err,items){
    callback(items);   
  })
}


exports.updateKeyword = function(item,callback){
  var collection = db.get().collection('pricePoints_used_fixed')
  console.log(item.keywords);
  collection.update({'keywords': {$in:item.keywords}},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 pricePoints_used_fixed document');
    console.log(item);
    callback(result);
  })
}

exports.update = function(user,callback){
  var collection = db.get().collection('pricePoints_used_fixed')
  collection.update({'_id': item._id},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 pricePoints_used_fixed document');
    console.log(item);
    callback(result);
  })
}




exports.addTag = function(itemId,tag,callback){
  var collection = db.get().collection('pricePoints_used_fixed')
  collection.update(
    {'_id': itemId},
    { $addToSet: {tags: tag}}, 
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      // assert.equal(1, result.ops.length)
      console.log('pushed 1 pricePoints_used_fixed to the item')
      callback(result)
  })
}


exports.removeTag = function(itemId,tag,callback){
  var collection = db.get().collection('pricePoints_used_fixed')
  collection.update(
    {'_id': itemId},
    { $pull: {tags: tag}}, 
    function(err, result) {
      assert.equal(err, null)
      assert.equal(1, result.result.n)
      console.log('pushed 1 pricePoints_used_fixed to the item')
      callback(result)
  })
}