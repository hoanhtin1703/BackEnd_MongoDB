const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const dotenv = require("dotenv");
var path = require("path");
const mongoose = require("mongoose");
const UserModel = require("./Model/UserModel");
const cors = require("cors");

const multer = require("multer");
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
console.log(path.join(__dirname, "public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Set up Global configuration access
dotenv.config();
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL, { dbName: "SocialMedia" });
  console.log("Connect MongoDB Successfully");
}
const { AuthController } = require("./v1/Controller/Auth");
const { BlogController } = require("./v1/Controller/Blog");
const { CommentController } = require("./v1/Controller/Comment");
const { hello, signup, singin, getuserbyid } = require("./Controller/Auth");
const {
  getallPosts,
  createNewPost,
  likePost,
  unlikePost,
} = require("./Controller/Post/Post");
const { uploadFilePost } = require("./middleware/file_upload");
// Auth Route
app.get("/", hello);
app.get("/getuserbyid/:id", getuserbyid);
app.post("/singup", signup);
app.post("/singin", singin);
// Post Route
// app.post("/createnewpost", [uploadFilePost], createNewPost);
app.get("/getallposts", getallPosts);
app.post("/like_post", likePost);
app.post("/unlike_post", unlikePost);
app.post("/createNewPost", uploadFilePost.single("file"), createNewPost);
app.listen(7000, () => {
  console.log(`Example app listening on port 3000!`);
});
//v1 Route Auth
app.get("/v1/profile/:id", AuthController.showprofile);
app.post("/v1/singin", AuthController.singin);
app.post("/v1/singup", AuthController.singup);
app.post("/v1/sendfriendrequest", AuthController.sendFriendrequest);
app.post("/v1/acceptfriendrequest", AuthController.acceptsentfriendRequest);
app.post("/v1/unfriend", AuthController.unfriend);
// v1 Route Blogs
app.get("/v1/getallposts", BlogController.getallPost);
app.post(
  "/v1/createNewPost",
  uploadFilePost.single("file"),
  BlogController.createnewPost
);
app.get("/v1/getnewpost", BlogController.paginationPost);
app.put("/v1/like_post", BlogController.likePost);
app.put("/v1/unlike_post", BlogController.unlikePost);
// v1 Route Comment
app.put("/v1/add_commnent", CommentController.addComment);
app.put("/v1/reply_commnent", CommentController.reply_comment);
