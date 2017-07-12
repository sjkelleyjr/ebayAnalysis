var ObjectId = require('mongodb').ObjectId
var assert = require('assert')
var db = require('../db')

exports.insert = function(item, callback) {
  var collection = db.get().collection('completedItems')
  collection.insert(item, function(err, result) {
    // assert.equal(err, null)
    // assert.equal(1, result.result.n)
    // assert.equal(1, result.ops.length)
    // catch(err){
      
    // }
    console.log('Inserted 1 document into the completedItems collection')
    console.log(item)
    callback(result)
  })
}



exports.find = function(id,callback){
  var collection = db.get().collection('completedItems')
  collection.findOne({'_id':id}, function(err, document) {
    assert.equal(err, null)
    console.log('Found 1 completedItems document')
    callback(document)
  })
}

exports.findByKeyword = function(keyword,callback){
  var collection = db.get().collection('completedItems');
  var cursor = collection.find({'keywords': keyword}).toArray(function(err,items){
    callback(items);   
  })
}

exports.updateKeyword = function(item,callback){
  var collection = db.get().collection('completedItems')
  console.log(item.keywords);
  collection.update({'keywords': {$in:item.keywords}},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 completedItems document');
    console.log(item);
    callback(result);
  })
}


exports.update = function(user,callback){
  var collection = db.get().collection('completedItems')
  collection.update({'_id': item._id},item, function(err, result) {
    assert.equal(err, null)
    assert.equal(1, result.result.n)
    console.log('updated 1 completedItems document');
    console.log(item);
    callback(result);
  })
}
