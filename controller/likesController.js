const likeModel = require('../models/likesModel');
const postModel = require('../models/postModel');
const { ObjectId } = require("mongodb");

class Like{
    static async findLikes(req, res, next){
        try{
            const { postId } = req.params;
            const posts = await likeModel.find({ post: postId }).exec()

            res.status(200).json(posts)
        }catch(err){
            next(err);
        }
    }

    static async findLikesByUser(req, res, next){
        try {
            const { userId } = req.params;
            const posts = await likeModel.find({ user: userId }).exec();

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

            // cek dari data likes suatu post, apakah ada like yg dari user
            const likes = await likeModel.find({ post: postId });
            likes.forEach(like => {
              if (like.user.toString() === userId.toString()) throw { name: "LikeTwice" }
            })

            const like = await likeModel.create({ user: userId, post: postId });
            const updatedPost = await postModel.findOneAndUpdate({_id: postId},
            {
              $push: {
                likes: like
              }
            })

            res.status(201).json(`You have liked this post`);
        } catch(err){
            next(err);
        }
    }

    static async findLike(req, res){
        try{
            const id = req.params.id
            const Post = await likeModel.findOne({_id: id}).exec()

            res.status(200).json(Post)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async editLike(req, res){
        try{
            const id = req.params.id
            
            await likeModel.updateOne({_id: id}, req.body)
            const updatedPost = await likeModel.find({_id: id}).exec()

            res.status(200).json(updatedPost)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async deleteLike(req, res){
        try{
            const id = req.params.id
            const deletedPost = await likeModel.find({_id: id}).exec()
            await likeModel.deleteOne({_id: id})

            res.status(201).json(deletedPost)
        }catch(err){
            res.status(500).json(err)
        }
    }

}

module.exports = Like