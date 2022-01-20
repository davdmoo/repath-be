const friendModel = require('../models/friendModel')
const userModel = require('../models/userModel')

class Friend{
    static async findFriends(req, res){
        try{
            const id = req.user.id;
            const friends = await friendModel.find({follower: id}).exec()

            res.status(200).json(friends)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addFriend(req, res){
        try{
            console.log(req.user);
            const id = req.user.id;
            const friendId = req.params.friendId

            const newFriend = await friendModel.create({
                follower: id,
                following: friendId
            })

            res.status(201).json(newFriend)
        }catch(err){
            console.log(err);
            res.status(500).json(err)
        }
    }

    static async deleteFriend(req, res){
        try {
            const id = req.user.id;
            const friendId = req.params.friendId

            const delFriend = await friendModel.findOne({
                follower: id,
                following: friendId
            })
            
            await friendModel.deleteOne({
                follower: id,
                following: friendId
            })

            res.status(201).json(delFriend)
        }catch (err){
            res.status(500).json(err)
        }
    }
}

module.exports = Friend