const express = require("express");
var app = express();
const bodyParser = require("body-parser");
const connectToDatabase = require("../../config/database");
const PostModel = require("../../Model/PostModel");
const crypto = require("crypto");
app.use(express.json());
const dotenv = require("dotenv");
const mongo = require("mongodb");
// for parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));
// for parsing multipart/form-data
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const AuthCollection = async () => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("Users");
    return collection;
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const collection = async () => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("Blogs");
    return collection;
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
dotenv.config();
const HOST_IP = process.env.HOST_URL;
console.log(HOST_IP);
module.exports.getallPosts = async (req, res) => {
  try {
    const postcollection = await collection();
    const Posts = await postcollection.find({}).toArray();
    const PostsList = [];
    Posts.forEach((doc) => {
      const postModel = new PostModel(
        doc._id,
        doc.author,
        doc.content,
        doc.createdAt,
        doc.updatedAt,
        doc.image_url,
        doc.likes_count,
        doc.comments_count,
        doc.likes,
        doc.comments
      );

      PostsList.push(postModel);
    });
    return res.json({
      success: true,
      status: 200,
      message: "",
      data: PostsList,
    });
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.createNewPost = async (req, res) => {
  try {
    const id_user = new mongo.ObjectId(req.body.author_id);
    const usercollection = await AuthCollection();
    const userbydata = await usercollection.findOne(
      {},
      {
        projection: {
          _id: id_user,
          username: 1,
          profilePicture: true,
          token: 1,
        },
      }
    );
    const postcollection = await collection();
    const data = {
      author: userbydata,
      content: req.body.content,
      image_url: req.file["filename"],
      like_count: 0,
      comments_count: 0,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await postcollection.insertOne(data);
    if (result) {
      res.json({
        post: data,
        status: true,
        message: "Tạo bài viết thành công",
      });
    } else {
      res.json({
        status: false,
        message: "Tạo bài viết không thành công",
      });
    }
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.likePost = async (req, res) => {
  try {
    const blog_id = new mongo.ObjectId(req.body.blog_id);
    const id_user = new mongo.ObjectId(req.body.author_id);
    const usercollection = await AuthCollection();
    const userbydata = await usercollection.findOne(
      {},
      {
        // Hiển thị data {id,username,profilePicture,token}
        projection: {
          _id: id_user,
          username: 1,
          profilePicture: true,
          token: 1,
        },
      }
    );
    const postcollection = await collection();
    const result = await postcollection.findOneAndUpdate(
      { _id: blog_id },
      { $inc: { like_count: 1 }, $push: { likes: userbydata } },
      { new: true }
    );
    if (result) {
      res.json({
        status: true,
        message: "like thành công",
      });
    } else {
      res.json({
        status: false,
        message: "like không thành công",
      });
    }
    console.log(result);
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.unlikePost = async (req, res) => {
  try {
    const blog_id = new mongo.ObjectId(req.body.blog_id);
    const id_user = new mongo.ObjectId(req.body.author_id);
    const usercollection = await AuthCollection();
    const userbydata = await usercollection.findOne(
      { _id: id_user },
      { projection: { _id: 1 } }
    );
    const postcollection = await collection();
    const result = await postcollection.findOneAndUpdate(
      { _id: blog_id },
      { $pull: { likes: { _id: userbydata._id } }, $inc: { like_count: -1 } },
      { new: true }
    );
    if (result) {
      res.json({
        status: true,
        message: "Unlike thành công",
      });
    } else {
      res.json({
        status: false,
        message: "Unlike không thành công",
      });
    }
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.comment = async (req, res) => {
  try {
    const blog_id = new mongo.ObjectId(req.body.blog_id);
    const id_user = new mongo.ObjectId(req.body.author_id);
    const usercollection = await AuthCollection();
    const userbydata = await usercollection.findOne(
      {},
      {
        // Hiển thị data {id,username,profilePicture,token}
        projection: {
          _id: id_user,
          username: 1,
          profilePicture: true,
          token: 1,
        },
      }
    );
    const postcollection = await collection();
    const result = await postcollection.findOneAndUpdate(
      { _id: blog_id },
      { $inc: { like_count: 1 }, $push: { likes: userbydata } },
      { new: true }
    );
    if (result) {
      res.json({
        status: true,
        message: "like thành công",
      });
    } else {
      res.json({
        status: false,
        message: "like không thành công",
      });
    }
    console.log(result);
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
