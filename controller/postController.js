const e = require('express');
const postModel = require('../models/postModel');
const likeModel = require('../models/likesModel');
const followModel = require('../models/followModel');
const userModel = require('../models/userModel');

class Post {
    static async findPosts(req, res, next){
        try {
            let filter = [];
            const friends = await followModel.find({ follower: req.user.id });
            // const friends = await friendModel.find().populate("user");
            friends.forEach(friend => {
              filter.push(friend.following)
            });

            const posts = await postModel.find().populate([{ path: "likes", populate: "userId" }, { path: "comments", populate: "userId" }, { path: "userId" }]);
            // const posts = await postModel.find().populate([{ path: "likes" }, { path: "comments" }, { path: "userId" }]);
            // let filterLikes = [];
            // posts.forEach(post => {
            //   filterLikes.push(post._id)
            // });

            // let payload = [posts];
            // const likes = await likeModel.find({ postId: filterLikes });

            // payload.push(likes);
            // console.log(likes);

            // res.status(200).json(payload);
            res.status(200).json(posts);
        } catch(err){
            next(err);
        }
    }

    static async addPost(req, res,next){
        try{
            const {type,text,imgUrl,location,title,artist,imageAlbum,albumName} = req.body
            const userId = req.user.id
            let payload = {
                type,
                userId,
            }
            
            if (type === 'text' && text) {
               payload.text = text
               payload.imgUrl = imgUrl
            }
           else if (type === "location" && location) {
              payload.location = location
            }
           else if (type === "music" && title){
                payload.title = title
                payload.artist = artist
                payload.imageAlbum = imageAlbum
                payload.albumName = albumName
            }
            else {
                throw {name : "NoInput"}
            }

            const user = await userModel.findById(userId);
            payload.firstName = user.firstName;

            if (user.imgUrl) {
              likeBody.imgUrl = user.imgUrl;
            };
           console.log(payload);
            const newPost = await postModel.create(payload);

            await userModel.findOneAndUpdate({_id: userId},
            {
              $push: {
                posts: newPost
              }
            });

            res.status(201).json(newPost);
        } catch(err){

            next(err)
        }
    }

    static async findPost(req, res) {
        try {
            const id = req.params.id
            const Post = await postModel.findOne({_id: id}).exec()

            res.status(200).json(Post)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async editPost(req, res){
        try{
            const id = req.params.id
            
            await postModel.updateOne({_id: id}, req.body)
            const updatedPost = await postModel.find({_id: id}).exec()

            res.status(200).json(updatedPost)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async deletePost(req, res){
        try{
            const id = req.params.id
            const deletedPost = await postModel.find({_id: id}).exec()
            await postModel.deleteOne({_id: id})

            res.status(201).json(deletedPost)
        }catch(err){
            res.status(500).json(err)
        }
    }

}

module.exports = Post