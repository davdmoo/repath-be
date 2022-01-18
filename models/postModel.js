const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');
const userModel = require('./userModel');

const postSchema = new Schema({
  text: String,
  imgUrl: String,
  user: {
      type: ObjectId,
      ref: "User"
  },
  comments: [{
    type: ObjectId,
    ref: "Comment"
  }],
  likes: [{
    type: ObjectId,
    ref: "User",
    unique: true
  }]
});

postSchema.plugin(uniqueValidator)
const postModel = mongoose.model('Post', postSchema);
module.exports = postModel