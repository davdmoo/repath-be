const userModel = require('../models/userModel')

class User{
    static async findUsers(req, res){
        try{
            console.log("masuk function");
            const users = await userModel.find().exec()

            res.status(200).json(users)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addUser(req, res){
        try{
            const newUser = await userModel.create(req.body)

            res.status(201).json(newUser)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async findUser(req, res){
        try{
            console.log("masuk function");
            const users = await userModel.find().exec()

            res.status(200).json(users)
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = User