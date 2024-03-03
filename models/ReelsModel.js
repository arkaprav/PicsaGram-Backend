const mongoose = require("mongoose");

const ReelModel = mongoose.Schema({
    video: {
        type: String,
        required: [true, "Image is required"]
    },
    createdBy: {
        type: String,
        required: [true, "createdBy is required"]
    },
    caption: {
        type: String,
        required: [true, "caption is required"]
    },
    likes: {
        type: String,
        default: "[]"
    },
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Reels", ReelModel);