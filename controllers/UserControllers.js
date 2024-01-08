const asyncHandler = require("express-async-handler");

const UserModel = require("../models/UserModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const path = require("path");

const Login = asyncHandler( async (req, res) => {
    const { name, password } = req.body;
    if(!name || !password){
        res.status(403);
        throw new Error("Invalid name or password");
    }
    let user = await UserModel.findOne({ email: name });
    if(!user){
        user = await UserModel.findOne({ username: name });
    }
    if(!user){
        res.status(404);
        throw new Error("Invalid username or email");
    }
    else{
        const comparePass = await bcrypt.compare(password, user.password);
        if (comparePass) {
            const accessToken = jwt.sign({
                user: {
                    id: user._id,
                    email: user.email,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
            );
            res.status(200).json(accessToken);
        }
        else{
            res.status(404);
            throw new Error("Invalid password");
        }
    }
});

const Register = asyncHandler( async (req, res) => {
    const { username, email, phone, password } = req.body;
    if(!username || !email || !password){
        res.status(403);
        throw new Error("All Fields are mandatory");
    }
    const existsWithEmail = await UserModel.find({ email });
    if(existsWithEmail.length !== 0){
        res.status(403);
        throw new Error("User Email already Exists");
    }
    const existsWithName = await UserModel.find({ username });
    if(existsWithName.length !== 0){
        res.status(403);
        throw new Error("User Name already Exists");
    }
    const existsWithPhone = await UserModel.find({ phone });
    if(existsWithPhone.length !== 0){
        res.status(403);
        throw new Error("User Phone No. already Exists");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        password: hashedPass
    });
    res.status(201).json(user);
});

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await UserModel.find();
    res.status(200).json(users);
});

const getSingleUser = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    res.status(200).json(user);
});

const updateSingleUser = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const { password } = req.body;
    let hashedPass = user.password;
    if(password){
        hashedPass = await bcrypt.hash(password, 10);
    }
    req.body = {
        ...req.body,
        password: hashedPass,
    };
    const updatedUser = await UserModel.findByIdAndUpdate( req.user.id, req.body );
    res.status(200).json(updatedUser);
});

const updateProfilePic = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    let profilePic = "";
    if(req.file){
        profilePic = req.file.path;
    }
    req.body = {
        profilePic
    };
    const updatedUser = await UserModel.findByIdAndUpdate( req.user.id, req.body );
    res.status(200).json(updatedUser);
});

const DeleteSingleUser = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const deletedUser = await UserModel.findByIdAndDelete(req.user.id);
    res.status(200).json(deletedUser);
});

const getProfilePic = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    const options = {
        root: path.join(__dirname,"../")
    };
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const profilePicPath = user.profilePic;
    if(profilePicPath === "") {
        res.sendFile("/profilePics/default.jpeg", options, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Sent:', profilePicPath);
            }
        });
    }
    const absPath = "/" + profilePicPath.split("\\")[0] + "/" + profilePicPath.split("\\")[1];
    res.sendFile(absPath, options, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent:', absPath);
        }
    });
});

const getCurrentUser = asyncHandler( async (req, res) => {
    const user = await UserModel.findOne({ _id: req.user.id });
    res.status(200).json(user);
})

const updateFollower = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const following = await UserModel.findById(req.params.id);
    if(!following) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const followers = JSON.parse(following.follower);
    const followings = JSON.parse(user.following);
    const followingData = {
        follower: JSON.stringify([ user._id, ...followers ]) ,
    };
    const followerData = {
        following: JSON.stringify([ following._id, ...followings ]),
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, followerData);
    const updatedFollowing = await UserModel.findByIdAndUpdate(req.params.id, followingData);
    res.status(200).json(updatedUser);
});

const deleteFollower = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const following = await UserModel.findById(req.params.id);
    if(!following) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const followers = JSON.parse(following.follower);
    const followings = JSON.parse(user.following);
    const updatedFollowers = JSON.stringify(followers.filter((fol) => {
        return fol !== user._id.toString();
    }));
    
    const updatedFollowings = JSON.stringify(followings.filter((fol) => {
        return fol !== following._id.toString();
    }));
    const followingData = {
        follower: updatedFollowers ,
    };
    const followerData = {
        following: updatedFollowings,
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, followerData);
    const updatedFollowing = await UserModel.findByIdAndUpdate(req.params.id, followingData);
    res.status(200).json(updatedUser);
});

module.exports = { Login, Register, getAllUsers, getSingleUser, updateSingleUser, DeleteSingleUser, updateProfilePic, getProfilePic, updateFollower, deleteFollower, getCurrentUser };