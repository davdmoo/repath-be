const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');
// const likeModel = require("./likesModel");

const likeSchema = new Schema({
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: "User"
  }
})

const commentSchema = new Schema({
  content: String
});

const postSchema = new Schema({
  type: {
    type:String,
    required:[true, "Please Pick Type of Post"],
  },
  text: String,
  imgUrl: String,
  location: String,
  title: String,
  artist: String,
  imageAlbum: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  likes: [likeSchema]
});

postSchema.plugin(uniqueValidator)
const postModel = mongoose.model('Post', postSchema);
const likeModel = mongoose.model("Like", likeSchema);
module.exports = {postModel, likeModel}