const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
// const secretKey = process.env.SECRETKEY;

class User {
    static async findUsers(req, res, next){
        try{
            const users = await userModel.find().exec()

            res.status(200).json(users)
        }catch(err){
            next(err)
        }
    }

    static async addUser(req, res, next){
        try{
            const newUser = await userModel.create(req.body);

            res.status(201).json(newUser)
        }catch(err){
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email) throw { name: "EmailRequired" };
            else if(!password) throw { name: "PassRequired" };

            const user = await userModel.findOne({ email });
            if (!user) throw { name: "InvalidCredentials" };

            const validate = await user.validatePassword(password);
            if (!validate) throw { name: "InvalidCredentials" };
            
            const payload = { email: user.email };
            const access_token = jwt.sign(payload, "repathkeren");
            
            res.status(200).json({ access_token });
        } catch (error) {
            next(error);
        }
    }

    static async findUser(req, res, next){
        try{
            const users = await userModel.find().exec()

            res.status(200).json(users)
        }catch(err){
            next(err)
        }
    }

    static async editUser(req, res, next){
        try{
            const id = req.user.id
            const {firstName, lastName, username, phoneNumber, city, imgUrl} = req.body
            
            await userModel.updateOne({_id: id}, {
                firstName,
                lastName,
                username,
                phoneNumber,
                imgUrl,
                city
            })

            const updatedUser = await userModel.find({_id: id}).exec()

            res.status(200).json(updatedUser)
        }catch(err){
            next(err)
        }
    }

    static async deleteUser(req, res, next){
        try{
            const id = req.params.id

            if(id == req.user.id){
                res.status(403).json("you cannot delete other user")
            }
            
            const deletedUser = await userModel.find({_id: id}).exec()
            await userModel.deleteOne({_id: id})

            res.status(200).json(deletedUser)
        }catch(err){
            next(err)
        }
    }
}

module.exports = User