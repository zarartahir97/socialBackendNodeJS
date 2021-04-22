const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        contentType: String,
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

module.exports = mongoose.model("Post", postSchema);
