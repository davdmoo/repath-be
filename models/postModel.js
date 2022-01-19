const mongoose = require('mongoose');
const { Schema } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');
const { commentSchema } = require('./commentModel');

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
  comments: [commentSchema],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "Like"
  }]
});

postSchema.plugin(uniqueValidator)
const postModel = mongoose.model('Post', postSchema);
module.exports = {postModel, postSchema};