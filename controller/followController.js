const followModel = require('../models/followModel')
const userModel = require('../models/userModel')

class Follow{
    static async findFollows(req, res){
        try{
            const id = req.user.id;
            const follows = await followModel.find({follower: id}).exec()

            res.status(200).json(follows)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addFollow(req, res){
        try{
            const id = req.user.id;
            const followId = req.params.followId

            const checkFollow = await followModel.findOne({
                follower: id,
                following: followId
            })

            if(checkFollow){
                return res.status(200).json("you already follow this user")
            }
            if(id == followId){
                return res.status(200).json("you cannot follow yourself")
            }

            const newFollow = await followModel.create({
                follower: id,
                following: followId
            })

            res.status(201).json(newFollow)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async deleteFollow(req, res){
        try {
            const id = req.user.id;
            const followId = req.params.followId

            const delFollow = await followModel.findOne({
                follower: id,
                following: followId
            })
            
            await followModel.deleteOne({
                follower: id,
                following: followId
            })

            res.status(201).json(delFollow)
        }catch (err){
            res.status(500).json(err)
        }
    }
}

module.exports = Follow