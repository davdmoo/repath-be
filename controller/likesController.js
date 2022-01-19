const likeModel = require('../models/likesModel');
const postModel = require('../models/postModel');
const { ObjectId } = require("mongodb");

class Like{
    static async findLikes(req, res){
        try{
            const id = req.params.id
            const posts = await likeModel.find({_id: id}).exec()

            res.status(200).json(posts)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addLike(req, res, next){
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            const post = await postModel.findOne(ObjectId(postId));
            if (!post) throw { name: "NotFound" };
            const like = await likeModel.create({
                userId,
                content
            })

            console.log(userId);

            post.likes.push({
              _id: new ObjectId,
              user: userId
            });

            console.log(post);

            await post.updateOne();
            console.log(post);

            res.status(201).json("You have liked this post");
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