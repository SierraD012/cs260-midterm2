// This represents the model for a ShopItem object and the functions you can call on it

var mongoose = require('mongoose');

var ShopItemSchema = new mongoose.Schema({
  name: String,
  price: {type: Number, default: 0},
  imgURL: String,
  numOrders: {type: Number, default: 0},
});

ShopItemSchema.methods.order = function(cb) {
  this.numOrders += 1; //MAKE SURE THESE VARIABLES MATCH WHAT THE SCHEMA SAYS ABOVE
  this.save(cb);
};


mongoose.model('ShopItem', ShopItemSchema);