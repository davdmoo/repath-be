const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;

class User{
    static async findUsers(req, res){
        try{
            const users = await userModel.find().exec()

            res.status(200).json(users)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async addUser(req, res){
        try{
            const newUser = await userModel.create(req.body);

            res.status(201).json(newUser)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email) res.status(400).json({ message: "Email is required" });
            else if (!password) res.status(400).json({ message: "Password is required" });

            const user = await userModel.findOne({ email });
            if (!user) res.status(401).json({ message: "Unauthorized/UserNotFound" });
            console.log(user);

            const validate = await user.validatePassword(password);
            if (!validate) res.status(401).json({ message: "Invalid email/password" });
            
            const payload = { email: user.email };
            const access_token = jwt.sign(payload, secretKey);
            
            res.status(200).json({ access_token });
        } catch (error) {
            console.log(error);
            res.status(500).json(error);
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

    static async editUser(req, res){
        try{
            const id = req.params.id
            await userModel.updateOne({_id: id} ,req.body)

            const updatedUser = await userModel.find({_id: id}).exec()

            res.status(200).json(updatedUser)
        }catch(err){
            res.status(500).json(err)
        }
    }

    static async deleteUser(req, res){
        try{
            const id = req.params.id
            const deletedUser = await userModel.find({_id: id}).exec()
            await userModel.deleteOne({_id: id})

            res.status(201).json(deletedUser)
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports = User