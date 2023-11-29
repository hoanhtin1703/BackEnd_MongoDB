const express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
const { Blog, User } = require("../../v1/Model/model");
const path = require("path");
module.exports.BlogController = {
  createnewPost: async (req, res) => {
    try {
      const blogs = new Blog({
        author: req.body.author,
        content: req.body.content,
        image_url: req.file.filename,
      });
      const saveBlog = await blogs.save(blogs);
      const user = await User.findById(saveBlog.author);
      await user.updateOne({ $push: { ownPost: saveBlog._id } });
      res.status(200).json({
        status: true,
        message: "Create new Blog successfully",
        data: await saveBlog.populate({
          path: "author",
          select: ["username", "profilePicture", "token"],
        }),
      });
    } catch (error) {
      console.error("Error fetching data from the database:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  getallPost: async (req, res) => {
    const blogs = await Blog.find({});
    res.status(200).json({
      success: true,
      status: 200,
      message: "",
      data: blogs,
    });
  },
  paginationPost: async (req, res, next) => {
    try {
      const page = req.query.page;
      const pageSize = req.query.pageSize;
      const blogs = await Blog.find()
        .sort({ _id: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate({
          path: "author",
          select: ["username", "profilePicture", "token"],
        })
        .populate({
          path: "comments",
          populate: [
            {
              path: "author",
              select: ["username", "profilePicture", "token", "isAdmin"],
            },
            {
              path: "replies",
              populate: {
                path: "author",
                select: ["username", "profilePicture", "token", "isAdmin"],
              },
            },
          ],
        })
        .exec();

      res.json({
        status: true,
        data: blogs,
        meta: {
          pageSize,
          page,
        },
      });
    } catch (error) {
      console.error("Error fetching data from the database:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  likePost: async (req, res) => {
    try {
      const blog_id = req.body.blog_id;
      const author_id = req.body.author_id;
      const data = await Blog.findOneAndUpdate(
        { _id: blog_id },
        { $inc: { like_count: 1 }, $addToSet: { likes: author_id } },
        { new: true }
      );
      res.json({
        data: data,
        status: true,
        message: "like thành công",
      });
    } catch (error) {
      console.error("Error fetching data from the database:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  unlikePost: async (req, res) => {
    try {
      const blog_id = req.body.blog_id;
      const author_id = req.body.author_id;
      const data = await Blog.findOneAndUpdate(
        { _id: blog_id },
        { $pull: { likes: author_id }, $inc: { like_count: -1 } },
        { new: true }
      );
      res.json({
        status: true,
        data: data,
        message: "un like thành công",
      });
    } catch (error) {
      console.error("Error fetching data from the database:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
};
