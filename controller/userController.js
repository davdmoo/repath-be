const userModel = require('../models/userModel');
const postModel = require('../models/postModel')
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

    static async findUserById(req, res, next){
        try {
            const { id } = req.params;
            const user = await userModel.findById(id).exec();
            if (!user) throw { name: "NotFound" };

            res.status(200).json(user);
        } catch(err){
            next(err)
        }
    }

    static async editUser(req, res, next){
        try{
            const id = req.user.id
           
              const payload = { 
                    firstName: req.body.firstName,
                    lastName : req.body.lastName,
                    username: req.body.username,
                    phoneNumber : req.body.phoneNumber,
                    city : req.body.city,
                    header :req.body.header,
                    imgUrl : req.body.imgUrl
                }

            if(!payload.firstName || !payload.lastName || !payload.username || !payload.phoneNumber || !payload.city){
                throw {name: "EditInput"}
            }
            const user = await userModel.findOne({_id: id})
            
            if (!user) throw { name: "NotFound" };

            await userModel.updateOne({_id: id}, 
            //     {
            //     firstName: firstName,
            //     lastName: lastName,
            //     username: username,
            //     phoneNumber: phoneNumber,
            //     imgUrl: imgUrl,
            //     city: city,
            //     header: header
            // }
             payload
            )

            const updatedUser = await userModel.findOne({_id: id}).exec()

            res.status(200).json(updatedUser)
        
        }catch(err){
            console.log(err, `AAAAA KNAPA`)
            next(err)
        }
    }

    static async deleteUser(req, res, next){
        try {
            const id = req.params.id;
            const userId = req.user.id;

            if(id !== userId.toString()) throw { name: "Forbidden" };

            const deletedUser = await userModel.findById(id).exec();
            if (!deletedUser) throw { name: "NotFound" };

            await userModel.deleteOne({_id: id});
            await postModel.deleteMany({ userId });

            res.status(200).json(`The following user has been deleted: ${deletedUser.email}`);
        } catch(err){
            next(err);
        }
    }
}

module.exports = User