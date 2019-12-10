const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({

    manage: {
        type: Schema.Types.ObjectId,
        ref: "Manage"
    },

});

module.exports = AdminSchema;
