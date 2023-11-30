const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../../v1/Model/model");
const mongoose = require("mongoose");
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
  showprofile: async (req, res) => {
    const authorId = req.params.id;
    const profile = await User.findById(authorId).populate({
      path: "ownPost",
    });
    if (!profile) {
      res.json({
        message: "Không tìm thấy người dùng này",
      });
    }
    res.json({
      status: true,
      data: profile,
    });
  },
  sendFriendrequest: async (req, res) => {
    try {
      const currentId = req.body.own_id;
      const authorId = req.body.author_id;
      const sendrequest = await User.findOneAndUpdate(
        { _id: currentId },
        {
          $addToSet: { sentfriendRequests: authorId },
        },
        {
          new: true,
          upsert: true,
        }
      );
      res.json({
        status: true,
        data: sendrequest,
      });
    } catch (error) {
      res.json({ status: false, message: error.message });
    }
  },
  // acceptsentfriendRequest: async (req, res) => {
  //   try {
  //     const ownId = req.body.own_id;
  //     const authorId = req.body.author_id;
  //     const owndata = await User.findById(ownId);
  //     if (owndata) {
  //       const existfriendrequest = owndata.sentfriendRequests.includes(
  //         new mongoose.Types.ObjectId(authorId)
  //       );
  //       const existfriend = owndata.friends.includes(
  //         new mongoose.Types.ObjectId(authorId)
  //       );
  //       if (existfriendrequest && !existfriend) {
  //         const acceptRequest = await User.findOneAndUpdate(
  //           { _id: ownId },
  //           { $addToSet: { friends: authorId } },
  //           { $pull: { sentfriendRequests: authorId } },
  //           { new: true }
  //         );
  //         res.json({ message: "Kết bạn thành công", data: acceptRequest });
  //       }
  //     }
  //   } catch (error) {
  //     res.json({ error: error.message });
  //   }
  // },
  acceptsentfriendRequest: async (req, res) => {
    try {
      const ownId = req.body.own_id;
      const authorId = req.body.author_id;
      // bulkWrite cho phép thực hiện nhiều truy vấn cùng 1 lúc
      await User.bulkWrite([
        {
          updateOne: {
            filter: { _id: ownId, sentfriendRequests: { $in: [authorId] } },
            update: {
              $pull: { sentfriendRequests: authorId },
              $addToSet: { friends: authorId },
            },
            upsert: true,
          },
        },
      ]);
      const user = await User.findById(ownId).populate({
        path: "friends",
      });
      res
        .status(200)
        .json({ status: true, message: "Addfriend successfully", data: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  unfriend: async (req, res) => {
    try {
      const ownId = req.body.own_id;
      const authorId = req.body.author_id;
      const data = await User.findByIdAndUpdate(
        ownId,
        { $pull: { friends: authorId } },
        { new: true }
      );
      res
        .status(200)
        .json({ status: true, message: "Unfriend successfully", data: data });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
