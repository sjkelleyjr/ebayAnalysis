var categoryMap = {};
categoryMap['Bags, Skins & Travel Cases'] = '171831'
categoryMap['Hard Drives'] = '171820'
categoryMap['Other Games'] = '234'
categoryMap['Headsets'] = '80183'
categoryMap['Cables & Adapters'] = '171814'
categoryMap['Video Capture & TV Tuner Cards'] = '3761'
categoryMap['Textbooks, Education'] = '2228'
categoryMap['Other Anime Collectibles'] = '1345'
categoryMap['Accessories'] = '48751'
categoryMap['Other Video Game Accessories'] = '49230'
categoryMap['Other Hunting'] = '383'
categoryMap['Memory Cards & Expansion Packs'] = '117045'
categoryMap['Internet & Media Streamers'] = '168058'
categoryMap['Headphones'] = '112529'

var ps4_excluded_items =  {name: 'ExcludeCategory', value: ['117042','139973','182175','171833','187','31583','171858',
    '38583','171821','182175','171826','171833','171821','187','117044',categoryMap['Bags, Skins & Travel Cases']
    ,categoryMap['Hard Drives'],categoryMap['Other Games'],categoryMap['Headsets'],
    categoryMap['Cables & Adapters'],categoryMap['Video Capture & TV Tuner Cards'],
    categoryMap['Textbooks, Education'],categoryMap['Other Anime Collectibles'],categoryMap['Accessories']
    ,categoryMap['Other Video Game Accessories'],categoryMap['Other Hunting'],categoryMap['Memory Cards & Expansion Packs']
    ,categoryMap['Internet & Media Streamers'],categoryMap['Headphones']]}


exports.addedKeywordFilters_ps4 = ['CONTROLLER','CAMERA','JAPAN','DRIVE','HARD DRIVE','HARDDRIVE','BUNDLE','GAMES','EXTRA'];


exports.hot_items = {
  // add additional fields
  outputSelector: ['AspectHistogram'],

  paginationInput: {
    entriesPerPage: 100,
    pageNumber: 1
  },
  itemFilter: [
    //these params are specific to playstation 4s
    {name: 'MaxPrice', value: '50'},
  ]
};

exports.used_completed_params_ps4_auction = {
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
    ps4_excluded_items,
     //used item condition values
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    //NOTE! LISTING TYPE MUST ALWAYS COME AFTER CONDITION!.
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.used_completed_params_ps4_fixed = {
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
    ps4_excluded_items,
     //used item condition values
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    //NOTE! LISTING TYPE MUST ALWAYS COME AFTER CONDITION!.
    {name: 'ListingType', value: 'FixedPrice'}

  ]
};

exports.new_completed_params_ps4_auction = {
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
    ps4_excluded_items,
    //new item condition values
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.new_completed_params_ps4_fixed = {
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
    ps4_excluded_items,
    //new item condition values
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value:['FixedPrice']},
  ]
};

exports.new_keyword_params_ps4_auction = {
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
    ps4_excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: 'Auction'},
  ]
};


exports.new_keyword_params_ps4_fixed = {
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
    ps4_excluded_items,
    {name: 'Condition', value:['1000' , '1500']},
    {name: 'ListingType', value: ['FixedPrice']},
  ]
};

//paramaeters to find used playstation 4 items.
exports.used_keyword_params_ps4_auction = {
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
    ps4_excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    {name: 'ListingType', value: 'Auction'}

  ]
};


exports.used_keyword_params_ps4_fixed = {
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
    ps4_excluded_items,
    //these are the condition values for used 3000 = used
    // 4000 = very good, 5000 = good, 6000 = acceptable
    {name: 'Condition', value:['3000' , '4000' ,  '5000' , '6000']},
    {name: 'ListingType', value: ['FixedPrice']}

  ]
};