const { ObjectId } = require("mongodb");
const friendModel = require("../models/friendModel")
const userModel = require('../models/userModel')

class Friend{
    static async findFriends(req, res, next){
        try {
            const {id} = req.user
            
            const friends = await userModel.findById(id).populate(
                { path: "friends", 
                populate: 
                [
                    { path: "sender" },
                    { path: "receiver" },
                ]})
            
            let payload = [];

            friends.friends.forEach(friend => {
                if(friend.sender._id.toString() == id.toString() && friend.status) {
                  payload.push(friend.receiver)
                } else if (friend.receiver._id.toString() == id.toString() && friend.status) {
                  payload.push(friend.sender)
                }
            })
            
            res.status(200).json(payload)
        } catch (error) {
            next(error)
        }
    }

    static async addFriend(req, res, next){
        try {
            const {id} = req.user;
            const {userId} = req.params;

            const friendRequests = await friendModel.find({status: false});
            friendRequests.forEach(fr => {
              if (fr.sender.toString() === id.toString() || fr.receiver.toString() === id.toString()) throw { name: "FriendTwice" };
            });
            
            const sendReq = await friendModel.create({
                sender: id,
                receiver: userId,
                status: false
            });

            res.status(201).json(sendReq);
        } catch (error) {
            next(error)
        }
    }

    static async getRequest(req, res, next){
        try {
            const {id} = req.user
            let request = await friendModel.find({receiver: id, status: false}).populate("sender")

            res.status(200).json(request)
        } catch (error) {
            next(error)
        }
    }

    static async accFriend(req, res, next){
        try {
            const {id} = req.user
            const {reqId} = req.params
            const friendReq = await friendModel.findById(reqId);
<<<<<<< HEAD
            console.log(friendReq,"========", id);
            if(friendReq.sender.toString() == id.toString()){
                throw {name: "Forbidden"};
            }
            if(friendReq.receiver.toString() !== id.toString()){
                throw {name: "Forbidden"};
            }

=======
>>>>>>> 03b159d63bc2963bcec79dbc47cee59297d8fb8f
            if(!friendReq) throw {name: "NotFound"};
            
            if(friendReq.sender.toString() === id.toString() || friendReq.sender.toString() !== id.toString() && friendReq.receiver.toString() !== id.toString()) {
                throw {name: "Forbidden"};
            }

            if (friendReq.status) throw { name: "AccFriendTwice" };
            
            
            const request = await friendModel.findOneAndUpdate(
                {_id: reqId},
                {
                    status: true
                })
            await userModel.findOneAndUpdate({_id: request.receiver},
                {
                    $push: 
                    {
                        friends: request.sender
                    }
                },
                {
                    upsert: true
                });

            await userModel.findOneAndUpdate({_id: request.sender},
                {
                    $push: {
                    friends: request.receiver
                    },
                    upsert: true
                });

            res.status(200).json({
                _id: reqId,
                status: true
            });
        } catch (error) {
            console.log(error, "INI ERROR DARI FRIEND CONTROLLER");
            next(error)
        }
    }

    static async delFriend(req, res, next){
        try {
            const {id} = req.user
            const { reqId } = req.params
            
            const friend = await friendModel.findById(reqId);
            if (!friend) throw { name: "NotFound" };
            console.log(friend, "<<<<< delete friend");
            
            if(friend.receiver.toString() !== id.toString()
            && friend.sender.toString() !== id.toString()){
                throw {name: "Forbidden"}
            }
            
            await friendModel.deleteOne({ _id: ObjectId(reqId) })
            
            res.status(200).json(friend)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Friend