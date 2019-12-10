const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({

    review: {
        type: Schema.Types.ObjectId,
        ref: "Review"
    },

    follows: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    followedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    endorses: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Restaurant"
        }
    ]
    // Endorsed By Owner and Critic
    // endorsedBy: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "User"
    //     }
    // ],
});

module.exports = CustomerSchema;
