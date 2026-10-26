import CommunityPost from "../models/communityPost.model.js";
import {
    togglePostLike,
    recordPostRepost,
    addPostComment,
    processPostReport
} from "../services/community.service.js";

export const createPost = async (req, res) => {
    try {
        const { title, content, type } = req.body;
        const userId = req.user._id;

        if (req.user.isBanned) {
            return res.status(403).json({ message: "Your account is banned and cannot post." });
        }

        const newPost = new CommunityPost({
            user: userId,
            title,
            content,
            type
        });

        await newPost.save();
        const populatedPost = await CommunityPost.findById(newPost._id).populate("user", "name email profilePic");
        
        res.status(201).json(populatedPost);
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find()
            .populate("user", "name email profilePic")
            .populate("comments.user", "name profilePic")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const updatedPost = await togglePostLike(id, userId);
        res.status(200).json(updatedPost);
    } catch (error) {
        const status = error.message === 'Post not found' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const repostPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const updatedPost = await recordPostRepost(id, userId);
        res.status(200).json(updatedPost);
    } catch (error) {
        const status = error.message === 'Post not found' ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const updatedPost = await addPostComment(id, userId, content);
        res.status(200).json(updatedPost);
    } catch (error) {
        const status = error.message === 'Post not found' ? 404 : 400;
        res.status(status).json({ message: error.message });
    }
};

export const reportPost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        await processPostReport(id, userId);
        res.status(200).json({ message: "Post reported successfully" });
    } catch (error) {
        const status = error.statusCode || (error.message === 'Post not found' ? 404 : 500);
        res.status(status).json({ message: error.message });
    }
};
