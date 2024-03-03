const asyncHandler = require("express-async-handler");

const UserModel = require("../models/UserModel");
const ReelsModel = require("../models/ReelsModel");

const createReels = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("user not authorized");
    }
    const { caption } = req.body;
    let video = "";
    if(!req.file){
        res.status(401);
        throw new Error("Can't create a Reel without an video!");
    }
    else{
        video = 'data:video/png;base64,' +  req.file.buffer.toString("base64");
    }
    if(!caption){
        res.status(401);
        throw new Error("Caption is required!");
    }
    const Reel = await ReelsModel.create({
        video,
        createdBy: req.user.id,
        caption
    });
    return res.status(201).json(Reel);
});

const updateReelLikes = asyncHandler(async (req, res) => {
    const Reel = await ReelsModel.findById(req.params.id);
    if(!Reel){
        res.status(404);
        throw new Error("Reel not Found");
    }
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User not Authorized");
    }
    const { likes } = Reel;
    const d = JSON.parse(likes);
    let data;
    if(d.includes(req.user.id)){
        const newD = d.filter((el) => {
            return el !== req.user.id;
        });
        data = {
            likes: JSON.stringify(newD),
        }
    }
    else {
        data = {
            likes: JSON.stringify([...d, req.user.id]),
        }
    }
    const updatedReel = await ReelsModel.findByIdAndUpdate(req.params.id, data);
    res.status(200).json({ message: "Reel Updated" });
});

const getAllReels = asyncHandler(async (req, res) => {
    const Reels = await ReelsModel.find().sort({ createdAt: -1 });
    res.status(200).json(Reels);
});

const getSingleReel = asyncHandler(async (req, res) => {
    const Reel = await ReelsModel.findById(req.params.id);
    if(!Reel) {
        res.status(404);
        throw new Error("Reel Not Found!");
    }
    res.status(200).json(Reel);
});

const getUserReels = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if(!user){
        res.status(404);
        throw new Error("User Not Found!");
    }
    console.log(user);
    const Reels = await ReelsModel.find({ createdBy: req.params.id }).sort({ createdAt: -1 });
    console.log(Reels);
    res.status(200).json(Reels);
});

const deleteReel = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User Not Authorized");
    }
    const Reel = await ReelsModel.findById(req.params.id);
    if(!Reel) {
        res.status(404);
        throw new Error("Reel Not Found!");
    }
    const comments = await CommentsModel.find({ ReelId: req.params.id });
    if(comments.length !== 0){
        const deletedReelComments = await CommentsModel.findAndDelete({ ReelId: req.params.id });
    }
    const deletedReel = await ReelsModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Reel Deleted!" });
});

module.exports = { getAllReels, getSingleReel, getUserReels, createReels, updateReelLikes, deleteReel }