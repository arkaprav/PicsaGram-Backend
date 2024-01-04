const mongoose = require("mongoose");

const UserModel = mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    phone: {
        type: Number,
        default: 0
    },
    tagLine: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
        default: ""
    },
    no_of_posts: {
        type: String,
        default: "[]"
    },
    follower: {
        type: String,
        default: "[]"
    },
    following: {
        type: String,
        default: "[]"
    }
});

module.exports = mongoose.model("Users", UserModel);