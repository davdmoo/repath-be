const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = require("mongodb");

const likeSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "User"
  },
  postId: {
    type: ObjectId,
    ref: "Post"
  }
}, { 
  timestamps: { createdAt: 'created_at' } 
});

const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
