const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        required: false,
    },
    followingList: {
        type: [String],
        required: false,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: false,
    },
});

module.exports = mongoose.model("User", userSchema);
