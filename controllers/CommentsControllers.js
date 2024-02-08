const asyncHandler = require("express-async-handler");

const CommentsModel = require("../models/CommentsModel");

const PostsModel = require("../models/PostsModel");

const UserModel = require("../models/UserModel");

const createComment = asyncHandler(async (req, res) => {
    const { caption, replyTo, postId } = req.body;
    if(!caption){
        res.status(401);
        throw new Error("Caption is required!");
    }
    if(!postId){
        res.status(401);
        throw new Error("PostId is required");
    }
    else{
        const post = await PostsModel.findById(postId);
        if(!post){
            res.status(404);
            throw new Error("Post Not Found");
        }
    }
    if(replyTo){
        const repliedComment = await CommentsModel.findById(replyTo);
        if(!repliedComment){
            res.status(404);
            throw new Error("Comment replied to not found or not exists anymore");
        }
    }
    const comment = await CommentsModel.create({
        caption,
        commentedBy: req.user.id,
        replyTo,
        postId
    });
    res.status(201).json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
    const comment = await CommentsModel.findById(req.params.id);
    if(!comment){
        res.status(404);
        throw new Error("Comment not Found");
    }
    const updatedComments = await CommentsModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({ message: "Comment Lik Updated!"});
});

const updateCommentLikes = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("USer Not Authorized");
    }
    const comment = await CommentsModel.findById(req.params.id);
    if(!comment){
        res.status(404);
        throw new Error("Comment not Found");
    }
    const { likes } = comment;
    let data = {
        likes: JSON.stringify([...JSON.parse(likes), req.user.id ]),
    };
    const updatedComment = await CommentsModel.findByIdAndUpdate(req.params.id, data);
    res.status(200).json({ message: "Post Updated" });
});

const getAllPostComments = asyncHandler(async (req, res) => {
    const comments = await CommentsModel.find({ postId: req.params.id });
    res.status(200).json(comments);
});

const getSingleComment = asyncHandler(async (req, res) => {
    const comment = await CommentsModel.findById(req.params.id);
    if(!comment) {
        res.status(404);
        throw new Error("Comment Not Found!");
    }
    res.status(200).json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
    const comment = await CommentsModel.findById(req.params.id);
    if(!comment) {
        res.status(404);
        throw new Error("Comment Not Found!");
    }
    const deletedComment = await CommentsModel.findByIdAndDelete(req.params.id);
    const comments =  await CommentsModel.find({ replyTo: req.params.id });
    if(comments.length !== 0){
        const deletedPostComments = await CommentsModel.findAndDelete({ replyTo: req.params.id });
    }
    res.status(200).json({ message: "Comment Deleted!" });
});

module.exports = { getAllPostComments, getSingleComment, createComment, updateComment, updateCommentLikes, deleteComment }