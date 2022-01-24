const followModel = require('../models/followModel')
const userModel = require('../models/userModel')

class Follow{
    static async findFollows(req, res, next) {
        try{
            const id = req.user.id;
            const follows = await followModel.find({follower: id}).populate("following").exec()
            // console.log(follows,`TESTTTT`)
            res.status(200).json(follows)
        }catch(err){
            next(err);
        }
    }

    static async addFollow(req, res, next){
        try{
            const id = req.user.id;
            const followId = req.params.followId
            
            const checkFollow = await followModel.findOne({
                follower: id,
                following: followId
            })

            if(checkFollow){
                return res.status(403).json("you already follow this user")
            }
            if(id.toString() == followId){
                return res.status(403).json("you cannot follow yourself")
            }

            const newFollow = await followModel.create({
                follower: id,
                following: followId
            })

            res.status(201).json(newFollow)
        }catch(err){
            next(err);
        }
    }

    static async deleteFollow(req, res, next){
        try {
            const id = req.user.id;
            const followId = req.params.followId

            const delFollow = await followModel.findOne({
                follower: id,
                following: followId
            })
            if(!delFollow){
                throw {name: "NotFound"}
            }
            await followModel.deleteOne({
                follower: id,
                following: followId
            })

            res.status(201).json(delFollow)
        }catch (err){
            next(err);
        }
    }

    static async findFollowers(req, res, next) {
        try{
            const id = req.user.id;
            const follows = await followModel.find({following: id}).populate("follower").exec()
            // console.log(follows,`TESTTTT`)
            res.status(200).json(follows)
        }catch(err){
            next(err);
        }
    }
}

module.exports = Follow