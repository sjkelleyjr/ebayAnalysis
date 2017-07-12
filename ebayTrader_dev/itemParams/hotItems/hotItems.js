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