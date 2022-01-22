const likeModel = require('../models/likesModel');
const postModel = require('../models/postModel');
const userModel = require("../models/userModel");
const { ObjectId } = require("mongodb");

class Like{
    static async findLikes(req, res, next){
        try{
            const { postId } = req.params;
            const posts = await likeModel.find({ postId: postId }).exec()

            res.status(200).json(posts)
        }catch(err){
            next(err);
        }
    }

    static async findLikesByUser(req, res, next){
        try {
            const { userId } = req.params;
            const posts = await likeModel.find({ userId: userId }).exec();

            res.status(200).json(posts);
        } catch(err) {
            next(err);
        }
    }

    static async addLike(req, res, next){
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            const post = await postModel.findOne(ObjectId(postId));
            if (!post) throw { name: "NotFound" };

            const likes = await likeModel.find({postId});

            likes.forEach(like => {
              if (like.userId.toString() === userId.toString()) { 
                throw { name: "LikeTwice" }
              };
            });

            const user = await userModel.findById(userId);
            let likeBody = { userId, postId, firstName: user.firstName };
            if (user.imgUrl) {
              likeBody.imgUrl = user.imgUrl;
            }

            const like = await likeModel.create(likeBody);
            
            await postModel.findOneAndUpdate({_id: postId},
            {
              $push: {
                likes: like
              }
            })

            res.status(201).json(like);
        } catch(err){
            next(err);
        }
    }

    // static async findLike(req, res){
    //     try{
    //         const id = req.params.id
    //         const Post = await likeModel.findOne({_id: id}).exec()

    //         res.status(200).json(Post)
    //     }catch(err){
    //         res.status(500).json(err)
    //     }
    // }

    // static async editLike(req, res){
    //     try{
    //         const id = req.params.id
            
    //         await likeModel.updateOne({_id: id}, req.body)
    //         const updatedPost = await likeModel.find({_id: id}).exec()

    //         res.status(200).json(updatedPost)
    //     }catch(err){
    //         res.status(500).json(err)
    //     }
    // }

    static async deleteLike(req, res, next){
        try{
            const { id } = req.params;
            const like = await likeModel.findById(id);
            if (!like) throw { name: "NotFound" };

            await likeModel.deleteOne({_id: id});

            await postModel.findOneAndUpdate({_id: like.post},
            {
                $pull: { likes: id }
            })

            res.status(201).json(like);
        } catch(err){
            next(err)
        }
    }
}

module.exports = Like