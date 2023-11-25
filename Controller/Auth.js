const bodyParser = require("body-parser");
const connectToDatabase = require("../config/database");
const UserModel = require("../Model/UserModel");
const crypto = require("crypto");
const mongo = require("mongodb");
const collection = async () => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("Users");
    return collection;
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.hello = async (req, res) => {
  try {
    const userCollection = await collection();
    const user = await userCollection.find({}).toArray();
    const userList = [];
    console.log("user", user);
    user.forEach((doc) => {
      const userModel = new UserModel(
        doc._id,
        doc.username,
        doc.password,
        doc.firstname,
        doc.lastname,
        doc.email,
        doc.isAdmin,
        doc.profilePicture,
        doc.coverPicture,
        doc.phone,
        doc.about,
        doc.isActive,
        doc.worksAt,
        doc.followers,
        doc.following
      );

      userList.push(userModel);
    });
    return res.json({
      success: true,
      status: 200,
      message: "user Logged in",
      data: userList,
    });
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports.signup = async (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");
  const userCollection = await collection();
  //check username and email exist from userModel
  const usernameExists = await userCollection.findOne({
    username: req.body.username,
  });
  const emailExists = await userCollection.findOne({
    email: req.body.email,
  });
  const data = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    isAdmin: false,
    profilePicture: "",
    coverPicture: "",
    phone: "",
    about: "",
    isActive: true,
    worksAt: "",
    followers: [],
    following: [],
    token: token,
  };
  //   Nếu trùng tên đăng nhập
  if (usernameExists) {
    res.json({
      status: false,
      message: "Tên đã bị trùng xin thử lại",
    });
    // Nếu trùng địa chỉ email
  } else if (emailExists) {
    res.json({
      status: false,
      message: "Địa chỉ email đã bị trùng xin thử lại",
    });
  } else {
    const result = await userCollection.insertOne(data);
    if (result) {
      res.json({
        status: true,
        message: "Đăng ký thành công",
        data: {
          username: req.body.username,
          password: req.body.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          phone: req.body.phone,
        },
      });
    }
  }
};
module.exports.singin = async (req, res) => {
  // Check số điện thoại và mật khẩu
  const userCollection = await collection();
  const acccountExists = await userCollection.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  // data = await userCollection.findOne({ email: req.body.email });
  // console.log(data);
  if (acccountExists) {
    res.json({
      data: acccountExists,
      status: true,
      message: "Đăng nhập thành công",
    });
  } else {
    res.json({
      status: false,
      message: "Sai số điện thoại hoặc mật khẩu xin vui lòng thử lại",
    });
  }
};
module.exports.update = async (id, req, res) => {
  // Check số điện thoại và mật khẩu

  // const userCollection = await collection();
  // const acccountExists = await userCollection.findOne({
  //   email: req.body.email,
  //   password: req.body.password,
  // });

  // data = await userCollection.findOne({ email: req.body.email });
  // console.log(data);
  if (acccountExists) {
    res.json({
      data: acccountExists,
      status: true,
      message: "Đăng nhập thành công",
    });
  } else {
    res.json({
      status: false,
      message: "Sai số điện thoại hoặc mật khẩu xin vui lòng thử lại",
    });
  }
};
module.exports.getuserbyid = async (req, res) => {
  const user_id = new mongo.ObjectId(req.params.id);
  try {
    const userCollection = await collection();
    const acccountExists = await userCollection.findOne({
      _id: user_id,
    });
    res.json({
      data: acccountExists,
      status: true,
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error("Error fetching data from the database:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
