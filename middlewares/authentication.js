const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRETKEY;
const { ObjectId } = require('mongodb');
const postModel = require('../models/postModel');

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
    next(err);
  }
}

// async function authorization (req, res, next){
//   try{
//     const userId = req.header.id
//     const {id} = req.params

//     const post = await postModel.findOne({_id: id})

//     if(post.userId !== userId){
//       throw { name: "Forbidden" }
//     }else{
//       next()
//     }
//   }catch(err){
//     next(err)
//   }
// }

module.exports = authentication
