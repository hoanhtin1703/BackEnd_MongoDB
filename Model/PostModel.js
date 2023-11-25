class PostModel {
  constructor(
    _id,
    author,
    content,
    createdAt,
    updatedAt,
    image_url,
    like_count,
    comments_count,
    likes,
    comments
  ) {
    this._id = _id;
    this.author = author;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.image_url = image_url;
    this.like_count = like_count;
    this.comments_count = comments_count;
    this.likes = likes;
    this.comments = comments;
  }
}
module.exports = PostModel;
