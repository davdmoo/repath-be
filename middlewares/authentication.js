const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRETKEY;
const { ObjectId } = require('mongodb');

async function authentication (req, res, next) {
  try {
    const access_token = req.headers.access_token;
    if (!access_token) throw { name: "TokenNotFound" };

    const payload = jwt.verify(access_token, "repathkeren");
    if (!payload) throw { name: "JsonWebTokenError" };

    const user = await userModel.findOne({ email: payload.email });
    if (!user) throw { name: "JsonWebTokenError" };

    req.user = {
      id: ObjectId(user._id),
      email: user.email
    };
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = authentication;
