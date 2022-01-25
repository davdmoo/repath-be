const { ObjectId } = require('mongodb');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');

class Comment{
    static async findComments(req, res, next){
        try {
            const { postId } = req.params;

            const comments = await commentModel.find({ postId }).exec();

            if (!comments) throw { name: "NotFound" };

            res.status(200).json(comments);
        } catch(err){
            next(err);
        }
    }

    static async addComment(req, res, next) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
            const userId = req.user.id;

            const post = await postModel.findOne(ObjectId(postId));
            if (!post) throw { name: "NotFound" };

            const user = await userModel.findById(userId);
            let commentBody = { userId, postId, content };
            if (user.imgUrl) {
              commentBody.imgUrl = user.imgUrl;
            };

            const newComment = await commentModel.create({ userId, postId, content });

            await postModel.findOneAndUpdate({_id: postId},
            {
              $push: {
                comments: newComment
              }
            });

            res.status(201).json(newComment);
        } catch(err) {
            next(err);
        }
    }

    // static async findComment(req, res, next) {
    //     try {
    //         const id = req.params.id
    //         const comment = await commentModel.findById(id).exec();

    //         if (!comment) throw { name: "NotFound" };

    //         res.status(200).json(comment)
    //     } catch(err){
    //         next(err);
    //     }
    // }

    static async editComment(req, res, next) {
        try{
            const id = req.params.id

            const comment = await commentModel.findOne({_id: id})
            if (!comment) throw { name: "NotFound" };

            await commentModel.updateOne({_id: id}, req.body)
            const updatedComment = await commentModel.find({_id: id}).exec()

            res.status(200).json(updatedComment)
        }catch(err){
            next(err);
        }
    }

    static async deleteComment(req, res, next) {
        try{
            const id = req.params.id;
            const userId = req.user.id
            
            const deletedComment = await commentModel.findById(id).exec();
            
            if (!deletedComment) throw { name: "NotFound" };

            if(deletedComment.userId.toString() !== userId.toString()){
                throw {name: "Forbidden"}
            }

            await commentModel.deleteOne({_id: id});

            await postModel.findOneAndUpdate({_id: deletedComment.postId},
            {
                $pull: { comments: id }
            });

            res.status(200).json(deletedComment)
        } catch(err) {
            console.log(err, "INI ERROR");
            next(err);
        }
    }

}

module.exports = Comment