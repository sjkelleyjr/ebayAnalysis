var excluded_items =  {};


exports.addedKeywordFilters = [];


exports.used_completed_auction = {
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],

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
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],

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
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],

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
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],

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
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],
  // categoryId: '139971',
  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: 'Auction'},
  ]
};


exports.new_keyword_fixed = {
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],

  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: ['FixedPrice']},
  ]
};

//paramaeters to find used playstation 4 items.
exports.used_keyword_auction = {
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],
  // add additional fields
  outputSelector: ['AspectHistogram'],
  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.used_keyword_fixed = {
  keywords: ["Apple iPhone 6 - 16GB - Space Gray (Factory Unlocked) Smartphone"],
  // add additional fields
  outputSelector: ['AspectHistogram'],
  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    {name: 'ListingType', value: ['FixedPrice']}

  ]
};
