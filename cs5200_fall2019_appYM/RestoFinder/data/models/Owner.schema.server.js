const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  // Owns a restaurant
  // set is_taken field true in restaurant
  // if owner claims a restaurant
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  // Endorsed By Owner and Critic
  endorsedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // Follows other critics
//  follows: [
//    {
//      type: Schema.Types.ObjectId,
//      ref: "User"
//    }
//  ] 

});

module.exports = OwnerSchema;
