const friendModel = require("../models/friendModel")
const userModel = require('../models/userModel')
const { ObjectId } = require("mongodb")

class Friend{
    static async findFriends(req, res, next){
        try {
            const {id} = req.user
            // const { friends } = await userModel.findById(id).populate({path: "friends", 
            // populate: [{path: "sender"}, {path: "receiver"}]
            // });
            // const friends = await friendModel.find({ $or: 
            //   [{ sender: id }, { receiver: id }],
            //   $and: [{ status: true }]
            // }).populate([{path: "sender"}, {path: "receiver"}]);
            const friends = await friendModel.find().exec();
            // find friends -> populate 2 2nya
            // bkin array kosong
            // loop -> setiap ketemu yg bukan id user -> push ke array
            let payload = [];
            // console.log(friends);

            friends.forEach(friend => {
                if(friend.sender.toString() == id.toString() && friend.status) {
                  payload.push(friend)
                } else if (friend.sender == id && friend.status) {
                  payload.push(friend)
                }
            })

            // console.log(payload);
            
            res.status(200).json(payload)
        } catch (error) {
            next(error)
        }
    }

    static async addFriend(req, res, next){
        try {
            const {id} = req.user
            const {followId} = req.params

            const sendReq = await friendModel.create({
                sender: id,
                receiver: followId,
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
            const request = await friendModel.find({receiver: id, status: false})

            res.status(200).json(request)
        } catch (error) {
            next(error)
        }
    }

    static async accFriend(req, res, next){
        try {
            const {id} = req.user
            const {reqId} = req.params

            const friendReq = await friendModel.findById(reqId)
            const request = await friendModel.findOneAndUpdate(
                {_id: reqId},
                {
                    status: true
                })
            
            await userModel.findOneAndUpdate({_id: friendReq.receiver},
                {
                    $push: {
                    friends: request
                    }
                });
            await userModel.findOneAndUpdate({_id: friendReq.sender},
                {
                    $push: {
                    friends: request
                    }
                });
            res.status(200).json(request)
        } catch (error) {
            next(error)
        }
    }

    static async delFriend(req, res, next){
        try {
            const { reqId } = req.params
            const friend = await friendModel.findById(reqId)
            if (!friend) throw { name: "NotFound" }

            const deleteStatus = await friendModel.deleteOne({ _id: ObjectId(reqId) })
            
            res.status(200).json(deleteStatus)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Friend