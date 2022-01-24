const likeModel = require('../models/likesModel');
const postModel = require('../models/postModel');
const userModel = require("../models/userModel");
const { ObjectId } = require("mongodb");

class Like{
    static async findLikes(req, res, next){
        try{
            const { postId } = req.params;

            const likes = await likeModel.find({ postId: postId }).exec()
            if (!likes) throw { name: "NotFound" };

            res.status(200).json(likes)
        }catch(err){
            next(err);
        }
    }

    static async findLikesByUser(req, res, next){
        try {
            const { userId } = req.params;

            const likes = await likeModel.find({ userId: userId }).exec();
            if (!likes) throw { name: "NotFound" };

            res.status(200).json(likes);
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
            if (!likes) throw { name: "NotFound" };

            likes.forEach(like => {
              if (like.userId.toString() === userId.toString()) { 
                throw { name: "LikeTwice" }
              };
            });

            const user = await userModel.findById(userId);
            if (!user) throw { name: "NotFound" };

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
            console.log(err, "INI DARI ADD LIKES ERROR");
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

    static async deleteLike(req, res, next){
        try{
            const { id } = req.params;
            const userId = req.user.id;
            const like = await likeModel.findById(id);
            if (!like) throw { name: "NotFound" };

            if (like.userId.toString() !== userId.toString()) throw { name: "Forbidden" };

            await likeModel.deleteOne({_id: id});

            await postModel.findOneAndUpdate({_id: like.postId},
            {
                $pull: { likes: id }
            });

            res.status(200).json(`You have unliked the post`);
        } catch(err){
            next(err)
        }
    }
}

module.exports = Like