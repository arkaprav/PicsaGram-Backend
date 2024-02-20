const asyncHandler = require("express-async-handler");

const UserModel = require("../models/UserModel");

const PostsModel = require("../models/PostsModel");

const CommentsModel = require("../models/CommentsModel");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

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
        user = await UserModel.findOne({ phone: parseInt(name) });
    }
    if(!user){
        res.status(404);
        throw new Error("Invalid username or email or phone");
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
            const data = {
                jwt: accessToken,
                id: user._id,
            }
            res.status(200).json(data);
        }
        else{
            res.status(404);
            throw new Error("Invalid password");
        }
    }
});

const Register = asyncHandler( async (req, res) => {
    const { username, email, phone, password } = req.body;
    if(!username || !email || !phone || !password){
        res.status(403);
        throw new Error("All Fields are mandatory");
    }
    const existsWithEmail = await UserModel.findOne({ email });
    if(existsWithEmail){
        res.status(403);
        throw new Error("User Email already Exists");
    }
    const existsWithName = await UserModel.findOne({ username });
    if(existsWithName){
        res.status(403);
        throw new Error("User Name already Exists");
    }
    const existsWithPhone = await UserModel.findOne({ phone: parseInt(phone) });
    if(existsWithPhone){
        res.status(403);
        throw new Error("User Phone No. already Exists");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
        username,
        email,
        password: hashedPass,
        phone: parseInt(phone)
    });
    res.status(201).json(user);
});

const getAllUsers = asyncHandler( async (req, res) => {
    const users = await UserModel.find().sort({ createdAt: 1 }).toArray(function(err, docs) {
        if (err) throw err;
    
        console.log(docs);
    });
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
    let profilePic = user.profilePic;
    if(req.file){
        profilePic = 'data:image/png;base64,' +  req.file.buffer.toString("base64");
    }
    req.body = {
        ...req.body,
        password: hashedPass,
        profilePic,
    };
    const updatedUser = await UserModel.findByIdAndUpdate( req.user.id, req.body );
    res.status(200).json({ message: "User Updated" });
});

const DeleteSingleUser = asyncHandler( async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const deletedUser = await UserModel.findByIdAndDelete(req.user.id);
    const deleteComments = await CommentsModel.findAndDelete({ commentedBy: req.user.id });
    const deletePosts = await PostsModel.findAndDelete({ createdBy: req.user.id });
    res.status(200).json({ message: "User Deleted!"});
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
    const updatedFollowing = await UserModel.findByIdAndUpdate(req.params.id, followingData);
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, followerData);
    res.status(200).json({ message: "Follower updated"});
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
    const updatedFollowing = await UserModel.findByIdAndUpdate(req.params.id, followingData);
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, followerData);
    res.status(200).json({ message: "follower deleted" });
});

const UpdateSavedPosts = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user) {
        res.status(404);
        throw new Error("User Not Found");
    }
    const post = await PostsModel.findById(req.params.id);
    if(!post) {
        res.status(404);
        throw new Error("Post Not Found");
    }
    const sp = JSON.parse(user.saved_posts);
    let data;
    if(sp.includes(req.params.id)){
        const newD = sp.filter((p) => {
            return p !== req.params.id;
        });
        data = {
            saved_posts: JSON.stringify(newD)
        }
    }
    else {
        data = {
            saved_posts: JSON.stringify([...sp, req.params.id])
        }
    }
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, data);
    res.status(200).json({ message: "User Updated"});
})

module.exports = { Login, Register, getAllUsers, getSingleUser, updateSingleUser, UpdateSavedPosts, DeleteSingleUser, updateFollower, deleteFollower, getCurrentUser };