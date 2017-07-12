var categoryMap = require('./categoryMap')

var excluded_items =  {name: 'ExcludeCategory', value: ['117042','139973','182175','171833','187','31583','171858',
    '38583','171821','182175','171826','171833','171821','187','117044',categoryMap.categoryMap['Bags, Skins & Travel Cases']
    ,categoryMap.categoryMap['Hard Drives'],categoryMap.categoryMap['Other Games'],categoryMap.categoryMap['Headsets'],
    categoryMap.categoryMap['Cables & Adapters'],categoryMap.categoryMap['Video Capture & TV Tuner Cards'],
    categoryMap.categoryMap['Textbooks, Education'],categoryMap.categoryMap['Other Anime Collectibles'],categoryMap.categoryMap['Accessories']
    ,categoryMap.categoryMap['Other Video Game Accessories'],categoryMap.categoryMap['Other Hunting'],categoryMap.categoryMap['Memory Cards & Expansion Packs']
    ,categoryMap.categoryMap['Internet & Media Streamers'],categoryMap.categoryMap['Headphones']]}


exports.addedKeywordFilters = ['CONTROLLER','CAMERA','JAPAN','DRIVE','HARD DRIVE','HARDDRIVE','BUNDLE','GAMES','EXTRA'];


exports.used_completed_auction = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1,
  },
  itemFilter: [
    {name:'SoldItemsOnly',value:true},
    //remove controllers etc. from the listings.
    excluded_items,
     //used item condition values
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    //NOTE! LISTING TYPE MUST ALWAYS COME AFTER CONDITION!.
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.used_completed_fixed = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1,
  },
  itemFilter: [
    {name:'SoldItemsOnly',value:true},
    //remove controllers etc. from the listings.
    excluded_items,
     //used item condition values
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    //NOTE! LISTING TYPE MUST ALWAYS COME AFTER CONDITION!.
    {name: 'ListingType', value: 'FixedPrice'}

  ]
};

exports.new_completed_auction = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1,
  },

  itemFilter: [
    {name:'SoldItemsOnly',value:true},
    //remove controllers etc. from the listings.
    excluded_items,
    //new item condition values
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.new_completed_fixed = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1,
  },

  itemFilter: [
    {name:'SoldItemsOnly',value:true},
    //remove controllers etc. from the listings.
    excluded_items,
    //new item condition values
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value:['FixedPrice']},
  ]
};

exports.new_keyword_auction = {
  keywords: ["Playstation 4", "Playstation4"],
  // categoryId: '139971',
  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    //these params are specific to playstation 4s
    {name: 'MinPrice', value: '150'},
    excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: 'Auction'},
  ]
};


exports.new_keyword_fixed = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    //this should be set based on the lower filter value decided in the price point db.
    {name: 'MinPrice', value: '80'},
    excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: ['FixedPrice']},
  ]
};

//paramaeters to find used playstation 4 items.
exports.allPS4s = {
  keywords: ["Playstation 4", "Playstation4"],
  // add additional fields
  outputSelector: ['AspectHistogram'],
  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    //these params are specific to playstation 4s
    // {name: 'MinPrice', value: '50'},
    excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    // {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    // {name: 'ListingType', value: 'Auction'}

  ]
};



exports.completedAll = {
  keywords: ["Playstation 4", "Playstation4"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1,
  },

  itemFilter: [
    {name:'SoldItemsOnly',value:true},
    //remove controllers etc. from the listings.
    excluded_items,
  ]
};




exports.used_keyword_fixed = {
  keywords: ["Playstation 4", "Playstation4"],
  // add additional fields
  outputSelector: ['AspectHistogram'],
  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    //these params are specific to playstation 4s
    {name: 'MinPrice', value: '50'},
    excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    {name: 'ListingType', value: ['FixedPrice']}

  ]
};
