const asyncHandler = require("express-async-handler");

const PostsModel = require("../models/PostsModel");

const CommentsModel = require("../models/CommentsModel");

const UserModel = require("../models/UserModel");

const createPosts = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("user not authorized");
    }
    const { caption } = req.body;
    let image = "";
    if(!req.file){
        res.status(401);
        throw new Error("Can't create a post without an image!");
    }
    else{
        image = 'data:image/png;base64,' +  req.file.buffer.toString("base64");
    }
    if(!caption){
        res.status(401);
        throw new Error("Caption is required!");
    }
    const post = await PostsModel.create({
        image,
        createdBy: req.user.id,
        caption
    });
    const data = {
        no_of_posts: JSON.stringify([...JSON.parse(user.no_of_posts), post._id]),
    }
    const updateUser = await UserModel.findById(req.user.id, data);
    res.status(201).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
    const post = await PostsModel.findById(req.params.id);
    if(!post){
        res.status(404);
        throw new Error("Post not Found");
    }
    let image = post.image;
    if(req.file){
        image = 'data:image/png;base64,' +  req.file.buffer.toString("base64");
    }
    data = {
        ...req.body,
        image,
    };
    const updatedPost = await PostsModel.findByIdAndUpdate(req.params.id, data);
    res.status(200).json(updatedPost);
});

const updatePostLikes = asyncHandler(async (req, res) => {
    const post = await PostsModel.findById(req.params.id);
    if(!post){
        res.status(404);
        throw new Error("Post not Found");
    }
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User not Authorized");
    }
    const { likes } = post;
    let data = {
        likes: JSON.stringify([...JSON.parse(likes), req.user.id]),
    }
    const updatedPost = await PostsModel.findByIdAndUpdate(req.params.id, data);
    res.status(200).json({ message: "Post Updated" });
});

const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await PostsModel.find();
    res.status(200).json(posts);
});

const getSinglePost = asyncHandler(async (req, res) => {
    const post = await PostsModel.findById(req.params.id);
    if(!post) {
        res.status(404);
        throw new Error("Post Not Found!");
    }
    res.status(200).json(post);
});

const getUserPosts = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User Not Found!");
    }
    const posts = await PostsModel.find({ createdBy: req.params.id });
    res.status(200).json(posts);
});

const deletePost = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User Not Authorized");
    }
    const post = await PostsModel.findById(req.params.id);
    if(!post) {
        res.status(404);
        throw new Error("Post Not Found!");
    }
    const deletedPost = await PostsModel.findByIdAndDelete(req.params.id);
    const data = {
        no_of_posts: JSON.stringify(JSON.parse(user.no_of_posts).filter((p) => {
            return p._id !== req.params.id;
        })),
    };
    const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, data);
    const comments =  await CommentsModel.find({ postId: req.params.id });
    if(comments.length !== 0){
        const deletedPostComments = await CommentsModel.findAndDelete({ postId: req.params.id });
    }
    res.status(200).json({ message: "Post Deleted!" });
});

module.exports = { getAllPosts, getSinglePost, getUserPosts, createPosts, updatePost, updatePostLikes, deletePost }