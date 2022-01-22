const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;

class User {
    static async findUsers(req, res, next){
        try{
            const { name } = req.query

            if(name){
                const users = await userModel.find({ username: { $regex: name + '.*' } }).exec()
                if (!users) throw { name: "NotFound" };
                
                res.status(200).json(users)
            }else{
                const users = await userModel.find().exec()
                if (!users) throw { name: "NotFound" };

                res.status(200).json(users)
            }
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

            const payloadClient = {
              email: user.email,
              id: user._id.toString(),
              firstName: user.firstName,
              lastName: user.lastName
            }
            if (user.imgUrl) payloadClient.imgUrl = user.imgUrl;
            if (user.header) payloadClient.header = user.header;
            
            const access_token = jwt.sign(payload, secretKey);
            
            res.status(200).json({ access_token, payloadClient });
        } catch (error) {
            next(error);
        }
    }

    // static async findUser(req, res, next){
    //     try{
    //         const users = await userModel.find().exec()

    //         res.status(200).json(users)
    //     }catch(err){
    //         next(err)
    //     }
    // }

    static async editUser(req, res, next){
        try{
            const id = req.user.id
            const { firstName,
                lastName,
                username,
                phoneNumber,
                city,
                imgUrl,
                header
            } = req.body

            if(!firstName || !lastName || !username || !phoneNumber || !city){
                throw {name: "EditInput"}
            }
            const user = await userModel.findOne({_id: id})
            
            if (!user) throw { name: "NotFound" };

            await userModel.updateOne({_id: id}, {
                firstName: firstName,
                lastName: lastName,
                username: username,
                phoneNumber: phoneNumber,
                imgUrl: imgUrl,
                city: city,
                header: header
            })

            const updatedUser = await userModel.findOne({_id: id}).exec()

            res.status(200).json(updatedUser)
        
        }catch(err){
            next(err)
        }
    }

    static async deleteUser(req, res, next){
        try{
            const id = req.params.id

            if(id !== req.user.id.toString() ){
                res.status(403).json({message: "you cannot delete other user"})
            } else {
                const deletedUser = await userModel.find({_id: id}).exec()
                if (!deletedUser) throw { name: "NotFound" };

                await userModel.deleteOne({_id: id})

                res.status(201).json(deletedUser)
            }
        }catch(err){
            next(err)
        }
    }
}

module.exports = User