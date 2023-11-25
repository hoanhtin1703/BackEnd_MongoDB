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
    profilePicture: String,
    coverPicture: String,
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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User = mongoose.model("Users", userSchema);
module.exports = { User };
