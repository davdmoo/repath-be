const postModel = require('../models/postModel');
const likeModel = require('../models/likesModel');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel');
const friendModel = require('../models/friendModel');
const { ObjectId } = require("mongodb");

class Post {
    static async findPosts(req, res, next){
        try {
            const {id} = req.user
            let filter = [];
            
            const friends = await friendModel.find({status: true}).populate([
                { path: "sender" },
                { path: "receiver"},
            ])
            
            let payload = []
            friends.forEach(el =>{
                if(el.sender._id.toString() == id.toString()){
                    payload = [...payload,...el.receiver.posts]
                }else if(el.receiver._id.toString() == id.toString()){
                    payload = [...payload,...el.sender.posts]
                }
            })
            
            const posts = await postModel.find().sort({ created_at: -1 }).populate([{ path: "likes", populate: "userId" }, { path: "comments", populate: "userId" }, { path: "userId" }]);

            posts.forEach(element => {
                const postId = ObjectId(element._id)
                // console.log(postId, "=========");
                if(payload.includes(postId)){
                    filter.push(element)
                }
            });

            res.status(200).json(posts);
        } catch(err){
            console.log(err);
            next(err);
        }
    }

    static async addPost(req, res,next) {
        try {
            const {type,text,imgUrl,location,title,artist,imageAlbum,albumName} = req.body
            const userId = req.user.id
            let payload = {
                type,
                userId,
            }
            
            if (type === 'text' && text) {
               payload.text = text
               payload.imgUrl = imgUrl
            } else if (type === "location" && location) {
              payload.location = location
            } else if (type === "music" && title){
                payload.title = title
                payload.artist = artist
                payload.imageAlbum = imageAlbum
                payload.albumName = albumName
            } else {
                throw { name: "NoInput" }
            }

            const newPost = await postModel.create(payload);

            await userModel.findOneAndUpdate({_id: userId},
            {
              $push: {
                posts: newPost
              }
            });

            res.status(201).json(newPost);
        } catch(err){
            next(err)
        }
    }

    // static async findPost(req, res, next) {
    //     try {
    //         const id = req.params.id
    //         const post = await postModel.findOne({_id: id}).exec()
    //         if (!post) throw { name: "NotFound" };

    //         res.status(200).json(post)
    //     }catch(err) {
    //         next(err);
    //     }
    // }

    static async editPost(req, res, next){
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const post = await postModel.findById(id);
            if (!post) throw { name: "NotFound" };

            if (post.userId.toString() !== userId.toString()) throw { name: "Forbidden" };
            
            await postModel.updateOne({_id: id}, req.body);
            const updatedPost = await postModel.findById(id).exec();

            res.status(200).json(updatedPost);
        } catch(err) {
            next(err);
        }
    }

    static async deletePost(req, res, next){
        try{
            const { id } = req.params;
            const userId = req.user.id;
            const post = await postModel.findById(id).exec();
            if (!post) throw { name: "NotFound" };

            if (post.userId.toString() !== userId.toString()) throw { name: "Forbidden" };

            await postModel.deleteOne({_id: id});
            await commentModel.deleteMany({postId: id})
            await likeModel.deleteMany({postId: id})

            res.status(200).json(post);
        }catch(err) {
            next(err);
        }
    }

}

module.exports = Post