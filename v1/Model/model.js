const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const token = crypto.randomBytes(32).toString("hex");
const validate = require("mongoose-validator");
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
      validate: {
        validator: function (value) {
          return value.length >= 8; // Kiểm tra độ dài mật khẩu phải ít nhất 8 ký tự
        },
        message: "Password must be at least 8 characters long",
      },
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
      required: true,
      unique: true,
      lowercase: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBxWM9QvgIJd3v8FXT99rxELV1mDHjybGS9A&usqp=CAU",
    },
    coverPicture: { type: String, default: null },
    phone: {
      type: String,
      default: null,
    },
    about: String,
    worksAt: String,
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    sentfriendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
    following: [],
    token: {
      type: String,
      required: true,
      default: token,
    },
    ownPost: [
      {
        type: [mongoose.Schema.Types.ObjectId],
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
      type: [mongoose.Schema.Types.ObjectId],
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      require: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },

  {
    timestamps: true,
  }
);

// create a collection
const Comment = mongoose.model("Comments", commentSchema);
const User = mongoose.model("Users", userSchema);
const Blog = mongoose.model("Blogs", Blogschema);
module.exports = { User, Blog, Comment };
