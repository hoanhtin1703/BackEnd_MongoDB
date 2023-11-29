const express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
const mongoose = require("mongoose");
const { Blog, User, Comment } = require("../../v1/Model/model");
module.exports.CommentController = {
  addComment: async (req, res) => {
    try {
      const { blog_id: postId, author_id: authorId, text: text } = req.body;
      console.log(postId);
      if (!text) {
        return res.status(400).json({ message: "Please write a comment" });
      }
      const newComment = new Comment({ text, author: authorId });
      const comment = await newComment.save();
      const data = await Blog.findOneAndUpdate(
        { _id: postId },
        { $inc: { comments_count: 1 }, $push: { comments: comment._id } },
        { new: true }
      )
        .populate({
          path: "comments",
          populate: {
            path: "author",
            select: ["username", "profilePicture", "token", "isAdmin"],
          },
        })
        .lean();
      res
        .status(201)
        .json({ message: "New comment added successfully", data: data });
    } catch (err) {
      console.log("Error in create comment: ", err);
      res.status(500).json({ message: "Failed to create new comment" });
    }
  },
  reply_comment: async (req, res) => {
    try {
      const blogId = new mongoose.Types.ObjectId(req.body.blog_id);
      const parentId = new mongoose.Types.ObjectId(req.body.comment_id);
      const post = await Blog.exists({ _id: blogId });
      if (post) {
        const commentExists = await Comment.exists({ _id: parentId });
        if (!commentExists) {
          return res
            .status(404)
            .json({ message: "Comment with given id not found in that post" });
        }
      }
      const newReply = new Comment({
        text: req.body.text,
        author: req.body.author_id,
      });
      const saveReply = await newReply.save();
      const data = await Comment.findByIdAndUpdate(
        parentId,
        { $push: { replies: newReply._id } },
        { new: true }
      ).populate({
        path: "replies",
        populate: {
          path: "author",
          select: ["username", "profilePicture", "token", "isAdmin"],
        },
      });
      res.status(200).json({
        data: data,
        message: "Reply to comment added successfully",
      });
    } catch (err) {
      console.log("Error in reply to comment: ", err);
      res.status(500).json({ message: "Failed to reply to the comment" });
    }
  },
  fecth_allComment: async (req, res) => {
    try {
      const page = req.query.page ? req.query.page : 1;
      const limit = req.query.perPage ? req.query.perPage : 20;
      const skip = limit * (page - 1);

      const comments = await Post.findById(postId)
        .populate("comments")
        .slice("comments", [skip, limit]);

      res
        .status(200)
        .json({ message: "Comments fetched successfully", data: comments });
    } catch (err) {
      console.log("Error in fetch all comments: ", err);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  },
};
