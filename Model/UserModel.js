class userModel {
  constructor(
    _id,
    username,
    password,
    firstname,
    lastname,
    email,
    isAdmin,
    profilePicture,
    coverPicture,
    phone,
    about,
    isActive,
    worksAt,
    followers,
    following,
    token
  ) {
    this._id = _id;
    this.username = username;
    this.password = password;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.isAdmin = isAdmin;
    this.profilePicture = profilePicture;
    this.coverPicture = coverPicture;
    this.phone = phone;
    this.about = about;
    this.isActive = isActive;
    this.worksAt = worksAt;
    this.followers = followers;
    this.following = following;
    this.token = token;
  }
}
module.exports = userModel;
