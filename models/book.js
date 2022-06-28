// extracts just the data from the query results

const _ = require('lodash');

const Book = module.exports = function (_node, myRating) {
  _.extend(this, _node.properties);

  this.id = this.cid;

  if(myRating || myRating === 0) {
    this['my_rating'] = myRating;
  }
};
