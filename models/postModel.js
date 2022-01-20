const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

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
  likes: [{
    type: ObjectId,
    ref: "Like"
  }]
});

postSchema.plugin(uniqueValidator)
const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;