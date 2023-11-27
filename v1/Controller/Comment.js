const express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
const { Blog, User, Comment } = require("../../v1/Model/model");
module.exports.CommentController = {
  addComment: async (req, res) => {
    try {
      const postId = req.body.blog_id;
      const authorId = req.body.author_id;
      const text = req.body.text;
      console.log(postId);
      if (!req.body.text) {
        return res.status(400).json({ message: "Please write a comment" });
      }
      const newComment = new Comment({
        text: text,
        author: authorId,
      });
      const comment = await newComment.save();
      await Blog.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      );
      res
        .status(201)
        .json({ message: "New comment added successfully", data: comment });
    } catch (err) {
      console.log("Error in create comment: ", err);
      res.status(500).json({ message: "Failed to create new comment" });
    }
  },
};
