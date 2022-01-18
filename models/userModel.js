const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  firstName:  String,
  lastName: String,
  email: {
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

userSchema.pre("save", async function save(next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  };
  try {
    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt);

    return next();
  } catch (error) {
      return next(err);
  }
});

userSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compareSync(data, this.password);
};

userSchema.plugin(uniqueValidator);
const userModel = mongoose.model("User", userSchema);

module.exports = userModel
