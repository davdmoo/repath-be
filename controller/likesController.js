const likesModel = require('../models/likesModel')

class Like{
    static async findLikes(req, res){
        try{
            const id = req.params.id
            const posts = await likeModel.find().exec()

            res.status(200).json(posts)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addLike(req, res){
        try{
            console.log(req.headers);
            req.body.user = req.headers.keyid
            console.log(req.body);
            const newpost = await likeModel.create(req.body)

            res.status(201).json(newpost)
        }catch(err){
            res.status(500).json(err)
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