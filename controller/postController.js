const postModel = require('../models/postModel')
const axios = require('axios');

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
            const {type,text,imgUrl,location,title} = req.body
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
            console.log(data.features,`<<<<<<<<`)
              payload.location = data.features[0].place_name
            }
           else if (type === "music" && title){
            const {data} = await axios({
                method: 'GET',
                url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
                params: {q: title},
                headers: {
                    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
                    'x-rapidapi-key': 'a0fd5fdf04msha9dde7e4ff273a1p10644fjsn1b7f916cb262'
                }
            })
                payload.title = data.data[0].title
                payload.artist = data.data[0].artist.name
                payload.imageAlbum = data.data[0].album.cover_big
                payload.albumName = data.data[0].album.title
            }
            else{
                throw {name : "NoInput"}
            }
           
            const newpost = await postModel.create(payload)

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