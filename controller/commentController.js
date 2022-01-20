const { ObjectId } = require('mongodb');
const { postModel } = require('../models/postModel');
const {commentModel} = require('../models/commentModel')

class Comment{
    static async findComments(req, res){
        try{
            const comments = await commentModel.find().exec()

            res.status(200).json(comments)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addComment(req, res){
        try{
            const { postId } = req.params;
            req.body.userId = req.user.id;

            const post = await postModel.findOne({_id: postId});
            if (!post) throw { name: "NotFound" };
            
            const comment = await commentModel.create(req.body);

            const updatedPost = await postModel.findOneAndUpdate({_id: postId},
            {
              $push: {
                comments: comment
              }
            })
            // console.log(updatedPost);
            res.status(201).json(updatedPost)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async findComment(req, res){
        try{
            const id = req.params.id
            const comment = await commentModel.findOne({_id: id}).exec()

            res.status(200).json(comment)
        }catch(err){
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

    static async deleteComment(req, res){
        try{
            const { postId } = req.params;
            const id = req.params.id
            // console.log(postId, id);
            const comment = await commentModel.findOne(ObjectId(id));
            const deletedComment = await commentModel.deleteOne(ObjectId(id));
            console.log(comment, "halooo");
            await postModel.findOneAndUpdate(
                ObjectId(postId),
                {
                    $pull: {
                        comments: ObjectId(id)
                    }
                }
            )
            console.log("masuk sini");
            const hellow = await postModel.findOne(ObjectId(postId))
            console.log(hellow, "ini");
            res.status(201).json(hellow)
        }catch(err){
            console.log(err);
            res.status(500).json(err)
        }
    }

}

module.exports = Comment