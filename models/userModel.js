const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");
const { postSchema } = require('./postModel');

const userSchema = new Schema({
  firstName:   {
    type:String,
    required:[true, "Please Input First Name"],
  },
  lastName: {
    type:String,
    required:[true, "Please Input Last Name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Input Email"]
  },
  password: {
    type:String,
    required:[true, 'Please Input Password'],
  },
  username:  {
    type:String,
    required:[true, 'Please Input Username'],
    unique: true
  },
  address: {
    type:String
  },
  phoneNumber: {
    type:String
  },
  city:{ 
      type:String
  },
  posts : [postSchema]
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
