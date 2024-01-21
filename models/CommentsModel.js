const mongoose = require("mongoose");

const CommentsModel = mongoose.Schema({
    caption: {
        type: String,
        required: [true, "Image is required"]
    },
    commentedBy: {
        type: String,
        required: [true, "createdBy is required"]
    },
    likes: {
        type: String,
        default: "[]"
    },
    replyTo: {
        type: String,
        default: ""
    },
    postId: {
        type: String,
        required: [true,"postId is required"]
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Comments", CommentsModel);