const friendModel = require("../models/friendModel")
const userModel = require('../models/userModel')
class Friend{
    static async findFriends(req, res, next){
        try {
            const {id} = req.user
            const friends = await userModel.findById(id).populate("friends")
            
            res.status(200).json(friends.friends)
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
            const {followId} = req.params
            const request = await friendModel.findOneAndUpdate(
                {sender: followId ,receiver: id},
                {
                    sender: followId ,receiver: id, status: true
                })
            res.status(200).json(request)
        } catch (error) {
            next(error)
        }
    }

    static async delFriend(req, res, next){
        try {
            const {id} = req.user
            const {followId} = req.params
            const decline = await friendModel.findOne({sender: followId, receiver: id})
            friendModel.deleteOne({sender: followId, receiver: id})

            res.status(201).json(decline)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Friend