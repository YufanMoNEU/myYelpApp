const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AdminSchema = require("./Admin.schema.server");
const OwnerSchema = require("./Owner.schema.server");
const CustomerSchema = require("./Customer.schema.server");

//const CriticSchema = require("./Critic.schema.server");
//const RegisteredUserScehma = require("./RegisteredUser.schema.server");
//const AdvertiserSchema = require("./Advertiser.schema.server");
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: 3
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 5
    },
    password: {
      type: String,
      required: true,
      minlength: 3
    },
    address: {
      streetaddress: {
        type: String,
        required: true
      },
      streetaddress2: {
        type: String
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      zipcode: {
        type: Number,
        required: true
      }
    },
    phone: {
      type: Number,
      required: true
    },
    
    // can remove this field
    // Add enum in userType
    userType: {
      type: String,
      required: true,
      enum: ["OWNER", "CUSTOMER", "ADMIN"]
    },
    owner: OwnerSchema,
    customer: CustomerSchema,
    admin: AdminSchema,
   
    date: {
      type: Date,
      default: Date.now
    }
  },
  { collection: "users" }
);

module.exports = UserModel = mongoose.model("User", UserSchema);
