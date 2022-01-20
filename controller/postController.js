const e = require('express');
const {postModel} = require('../models/postModel')
const axios = require('axios');

class Post{
    static async findPosts(req, res){
        try{
            const posts = await postModel.find().exec()
            console.log("masuk");

            res.status(200).json(posts)
        }catch(err){
            console.log(err);
            res.status(500).json(err)
        }
    }

    static async addPost(req, res,next){
        try{
            const {type,text,imgUrl,location,title,artist,imageAlbum} = req.body
            const userId = req.user.id
            let payload = {
                type,
                userId,
            }
            
            if (type === 'text' && text) {
               payload.text = text
               payload.imgUrl = imgUrl
            }
           else if (type === "location" && location) {
            const {data} = await axios({
                method: 'GET',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?country=id&proximity=-73.990593%2C40.740121&types=place%2Cpostcode%2Caddress&access_token=pk.eyJ1IjoiYWduZXNzdXJ5YSIsImEiOiJja3ltMmt5cnExczhpMnBvbHZzNjZwNHlyIn0.SdeuPBofv_1xPCmVIlI_-Q`,
            })
            console.log(data.features[0].place_name,`<<<<<<<<`)
              payload.location = data.features[0].place_name
            }
           else if (type === "music" && title){
                payload.title = title
                payload.artist = artist
                payload.imageAlbum = imageAlbum
            }
            else{
                throw {name : "NoInput"}
            }
           
            const newpost = await (await postModel.create(payload)).populate('User')

            res.status(201).json(newpost)
        }catch(err){
            console.log(err.data, `AAAAA`)
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