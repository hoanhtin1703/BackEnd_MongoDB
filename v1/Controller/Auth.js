const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../../v1/Model/model");
module.exports.AuthController = {
  // Signin function
  singin: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      //   Tìm người dùng với địa chỉ email
      const user = await User.findOne({
        email: email,
      });
      //   Kiểm tra có người dùng với địa chỉ email này không
      if (!user) {
        res.status(500).json({
          status: false,
          message: "None use of Email Address",
        });
      } else {
        // Kiểm tra password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          res.status(500).json({
            status: false,
            message: "Password is Wrong",
          });
        } else {
          res.status(200).json({
            data: user,
            status: true,
            message: "Login is successfully",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data from the database:", error.message);
      res.status(500).send("Internal Server Error");
    }
  },
  // Singup function
  singup: async (req, res) => {
    try {
      const newAuth = new User(req.body);
      const saveAuth = await newAuth.save(newAuth);
      res.status(200).json({
        status: true,
        data: saveAuth,
      });
    } catch (error) {
      if (error.code === 11000) {
        //duplicate key error
        if (error.keyPattern.username) {
          //username is duplicated
          res.json({
            status: false,
            message: "Tên đã bị trùng xin thử lại",
          });
        } else if (error.keyPattern.email) {
          //email is duplicated
          res.json({
            status: false,
            message: "Địa chỉ email đã bị trùng xin thử lại",
          });
        }
      } else {
        //other errors
        res.json({ status: false, message: error.message });
      }
    }
  },
};
