const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
var uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
  firstName:  String,
  lastName: String,
  email:   {
      type: String,
      unique: true,
      required: [true, "please input email"]
  },
  password: String,
  posts : [{
    type: ObjectId,
    ref: "Post"
  }]
});

userSchema.plugin(uniqueValidator)
const userModel = mongoose.model("User", userSchema);
module.exports = userModel