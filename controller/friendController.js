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
            console.log(error);
            next(error)
        }
    }

    static async addFriend(req, res, next){
        try {
            const {id} = req.user
            const {userId} = req.params
            
            const sendReq = await friendModel.create({
                sender: id,
                receiver: userId,
                status: false
            })

            res.status(201).json(sendReq)
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
            console.log(reqId);
            
            const friendReq = await friendModel.findById(reqId)
            
            if(friendReq.sender.toString() == id.toString()){
                throw {name: "Forbidden"}
            }
            if(friendReq.sender.toString() !== id.toString() && friendReq.receiver.toString() !== id.toString()){
                throw {name: "Forbidden"}
            }
            if(!friendReq){
                throw {name: "NotFound"}
            }

            const request = await friendModel.findOneAndUpdate(
                {_id: reqId},
                {
                    status: true
                })
            
            const friendReceiver = await userModel.findOneAndUpdate({_id: friendReq.receiver},
                {
                    $push: {
                    friends: request
                    }
                });
            const friendSender = userModel.findOneAndUpdate({_id: friendReq.sender},
                {
                    $push: {
                    friends: request
                    }
                });
            console.log(friendReceiver, friendSender);
            // const list = await friendModel.find()
            console.log(request)
            res.status(200).json(request)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    static async delFriend(req, res, next){
        try {
            const {id} = req.user
            const { reqId } = req.params
            const list = await friendModel.find()
            console.log(list);
            const friend = await friendModel.findOne({_id: ObjectId(reqId)})
            console.log(friend);
            if (!friend) throw { name: "NotFound" }
            
            if(friend.receiver.toString() !== id.toString()
            && friend.sender.toString() !== id.toString()){
                throw {name: "Forbidden"}
            }
            console.log("masuk uhuy delete request");
            // await friendModel.deleteOne({ _id: ObjectId(reqId) })
            
            res.status(200).json(friend)
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}

module.exports = Friend