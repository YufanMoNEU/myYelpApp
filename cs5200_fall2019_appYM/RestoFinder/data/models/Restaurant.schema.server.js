const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    id: String, // Yelp id for hitting API
    name: {
      type: String,
      required: true,
      minlength: 3
    },
    // if restaurant has an owner
    is_claimed: Boolean,
    location: {
      address1: String,
      address2: String,
      city: String,
      state: String,
      zip_code: String,
      country: String,
      display_address: [String],
      cross_streets: String
    },

    phone: {
      type: String,
      required: true
    },
    url: {
      type: String
      // add validations here
    },


      // favoriteBy: [
      //     {
      //         type: Schema.Types.ObjectId,
      //         ref: "Restaurant"
      //     }
      // ],
    // price: String,
    rating: Number,
    review_count: Number,
    // is_closed: Boolean,
    image_url: String,
    // hours: [hoursSchema],
    // photos: [String],
    // categories: [categorySchema]
  },
  { collection: "restaurants" }
);

module.exports = RestaurantModel = mongoose.model("Restaurant", RestaurantSchema);
