const { ObjectId } = require("mongodb");
const friendModel = require("../models/friendModel")
const userModel = require('../models/userModel')

class Friend{
    static async findFriends(req, res, next){
        try {
            const {id} = req.user
            
            // const friends = await userModel.findById(id).populate(
            //     { path: "friends", 
            //     populate: 
            //     [
            //         { path: "sender" },
            //         { path: "receiver" },
            //     ]})
            
            // let payload = [];

            // friends.friends.forEach(friend => {
            //     if(friend.sender._id.toString() == id.toString() && friend.status) {
            //       payload.push(friend.receiver)
            //     } else if (friend.receiver._id.toString() == id.toString() && friend.status) {
            //       payload.push(friend.sender)
            //     }
            // })

            const friends = await friendModel.find({status: true}).populate([
                { path: "sender" },
                { path: "receiver"},
            ])
            
            let payload = []
            friends.forEach((el, idx) =>{
                if(el.sender._id.toString() == id.toString()){
                    el.receiver.phoneNumber = el._id
                    payload.push(el.receiver)
                }else if(el.receiver._id.toString() == id.toString()){
                    el.sender.phoneNumber = el._id
                    payload.push(el.sender)
                }
            })
            console.log(payload);
            res.status(200).json(payload)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async addFriend(req, res, next){
        try {
            const {id} = req.user;
            const {userId} = req.params;

            const friendRequests = await friendModel.find({status: false});
            friendRequests.forEach(fr => {
                if ( (fr.sender.toString() === id.toString() && fr.receiver.toString() === userId) || (fr.receiver.toString() === id.toString() && fr.sender.toString() === userId) ) throw { name: "FriendTwice" };
              });

            const friendRequests2 = await friendModel.find({status: true});
            friendRequests2.forEach(fr => {
                if ( (fr.sender.toString() === id.toString() && fr.receiver.toString() === userId) || (fr.receiver.toString() === id.toString() && fr.sender.toString() === userId) ) throw { name: "AccFriendTwice" };
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
            next(error)
        }
    }

    static async delFriend(req, res, next){
        try {
            const {id} = req.user
            const { reqId } = req.params
            
            const friend = await friendModel.findById(reqId);
            if (!friend) throw { name: "NotFound" };
            
            if(friend.receiver.toString() !== id.toString()
            && friend.sender.toString() !== id.toString()){
                throw {name: "Forbidden"}
            }
            await friendModel.deleteOne({ _id: ObjectId(reqId)})
            
            if(friend.sender.toString() == id.toString()){
                await userModel.findOneAndUpdate({_id: id},
                    {
                        $pull: { friends:  friend.receiver}
                    });
            }else if(friend.receiver.toString() == id.toString()){
                await userModel.findOneAndUpdate({_id: id},
                    {
                        $pull: { friends:  friend.sender}
                    });
            }
            
            res.status(200).json(friend)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Friend