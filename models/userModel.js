const { ObjectId } = require('mongodb');
const mongoose = require('../config/monggoConfig');
const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  firstName:   {
    type: String,
    required: [true, "Please Input First Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please Input Last Name"],
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    required: [true, "Please Input Email"]
  },
  password: {
    type: String,
    required:[true, 'Please Input Password'],
  },
  username:  {
    type: String,
    required: [true, 'Please Input Username'],
    unique: true,
    sparse: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please input phone number']
  },
  city:{ 
    type: String,
    required: [true, 'Please input city']
  },
  posts : [{
    type: ObjectId,
    ref: "Post"
  }],
  imgUrl: {
    type: String
  }
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
