const e = require('express');
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

    static async addPost(req, res,next){
        try{
            const {type,text,imgUrl,location,title,artist,imageAlbum} = req.body
            const userId = "61e6b11cd4312d6b347f6bcc"
            let payload = {
                type,
                userId,
            }
            if (type === 'text' && text) {
               payload.text = text
               payload.imgUrl = imgUrl
            }
           else if (type === "location" && location) {
              payload.location = location
            }
           else if (type === "music" && title){
                payload.title = title
                payload.artist = artist
                payload.imageAlbum = imageAlbum
            }
            else{
                throw {name : "NoInput"}
            }
           
            const newpost = await postModel.create(payload)

            res.status(201).json(newpost)
        }catch(err){
            console.log(err, `AAAAA`)
            next(err)
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