const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("hex");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
    phone: {
      type: String,
      default: "",
    },
    about: String,
    worksAt: String,
    followers: [],
    following: [],
    token: {
      type: String,
      require: true,
      default: token,
    },
    ownPost: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blogs",
      },
    ],
  },

  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const Blogschema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    content: {
      type: String,
      require: true,
    },
    image_url: {
      type: String,
      require: true,
    },
    like_count: {
      type: Number,
      default: 0,
    },
    comments_count: {
      type: Number,
      default: 0,
    },
    likes: [],
    comments: [],
  },
  { timestamps: true }
);
const User = mongoose.model("Users", userSchema);
const Blog = mongoose.model("Blogs", Blogschema);
module.exports = { User, Blog };
