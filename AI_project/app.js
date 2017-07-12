var ebay        = require('./ebayQueries/ebayQueries')
var ps4         = require('./itemParams/ps4/ps4')
var db          = require('./db');


db.connect('MONGOURL', function(err){
  if(err) {
    console.log('Unable to connect to Mongo')
    process.exit(1)
  } else {

    console.log('mongolab connection successful');
    ebay.findByKeyword(ps4.allPS4s,ps4.addedKeywordFilters);
    //ebay.findCompletedKeyword(ps4.completedAll,120,550,ps4.addedKeywordFilters)
  }
})
