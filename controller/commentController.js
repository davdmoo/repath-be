const { ObjectId } = require('mongodb');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel');

class Comment{
    static async findComments(req, res){
        try{
            const id = req.params.postId
            const comments = await commentModel.find({postId:ObjectId(id)}).exec()

            res.status(200).json(comments)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addComment(req, res, next) {
        try {
            const { postId } = req.params;
            const { content } = req.body;
        
            const user = await userModel.findOne(ObjectId(req.user.id))

            const post = await postModel.findOne(ObjectId(postId));
            if (!post) throw { name: "NotFound" };
            
            const newComment = await commentModel.create({ 
                postId: postId,
                content: content,
                firstName: user.firstName,
                imgUrl: user.imgUrl
            });

            await postModel.findOneAndUpdate({_id: postId},
            {
              $push: {
                comments: newComment
              }
            });

            res.status(201).json(newComment);
        } catch(err) {
            console.log(err);
            next(err);
        }
    }

    static async findComment(req, res) {
        try {
            const id = req.params.id
            const comment = await commentModel.findOne({_id: id}).exec()

            res.status(200).json(comment)
        } catch(err){
            res.status(500).json(err)
        }
    }

    static async editComment(req, res){
        try{
            const id = req.params.id
            
            await commentModel.updateOne({_id: id}, req.body)
            const updatedComment = await commentModel.find({_id: id}).exec()

            res.status(200).json(updatedComment)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async deleteComment(req, res, next){
        try{
            const id = req.params.id;
            
            const deletedComment = await commentModel.findById(id).exec();
            if (!deletedComment) throw { name: "NotFound" };
            await commentModel.deleteOne({_id: id});

            await postModel.findOneAndUpdate({_id: deletedComment.postId},
            {
                $pull: { comments: id }
            });

            res.status(201).json(deletedComment)
        } catch(err) {
            console.log(err);
            next(err);
        }
    }

}

module.exports = Comment