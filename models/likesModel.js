const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = require("mongodb");

const likeSchema = new Schema({
  user: {
    type: ObjectId,
    ref: "User"
  }
});


const likeModel = mongoose.model("Like", likeSchema);

module.exports = likeModel;
