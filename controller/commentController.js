const commentModel = require('../models/commentModel')

class Comment{
    static async findComments(req, res){
        try{
            const id = req.params.postId;
            const comments = await commentModel.find().exec()

            res.status(200).json(comments)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addComment(req, res){
        try{
            const newComment = await commentModel.create(req.body);

            res.status(201).json(newComment)
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
            const id = req.params.id
            const deletedComment = await commentModel.find({_id: id}).exec()
            await commentModel.deleteOne({_id: id})

            res.status(201).json(deletedComment)
        }catch(err){
            res.status(500).json(err)
        }
    }

}

module.exports = Comment