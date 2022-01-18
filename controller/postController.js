const postModel = require('../models/postModel')

class Post{
    static async findPosts(req, res){
        try{
            console.log("masuk function");
            const posts = await postModel.find().exec()

            res.status(200).json(posts)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addPost(req, res){
        try{
            console.log(req.headers);
            req.body.user = req.headers.keyid
            console.log(req.body);
            const newpost = await postModel.create(req.body)

            res.status(201).json(newpost)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async findPost(req, res){
        try{
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