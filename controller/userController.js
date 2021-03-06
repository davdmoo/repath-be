const userModel = require('../models/userModel');
const postModel = require('../models/postModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRETKEY;
const { OAuth2Client } = require('google-auth-library');

class User {
  static async findUsers(req, res, next) {
    try {
      const { name } = req.query;

      if (name) {
        const users = await userModel.find({ username: { $regex: '^' + name, $options: 'i' } }).exec();

        res.status(200).json(users);
      } else {
        const users = await userModel.find().exec();
        if (!users) throw { name: 'NotFound' };

        res.status(200).json(users);
      }
    } catch (err) {
      next(err);
    }
  }

  static async addUser(req, res, next) {
    try {
      const newUser = await userModel.create(req.body);

      res.status(201).json(newUser);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: 'EmailRequired' };
      else if (!password) throw { name: 'PassRequired' };

      const user = await userModel.findOne({ email });
      if (!user) throw { name: 'InvalidCredentials' };

      const validate = await user.validatePassword(password);
      if (!validate) throw { name: 'InvalidCredentials' };

      const payload = { email: user.email };

      const payloadClient = {
        email: user.email,
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
      };
      if (user.imgUrl) payloadClient.imgUrl = user.imgUrl;
      if (user.header) payloadClient.header = user.header;

      const access_token = jwt.sign(payload, secretKey);

      res.status(200).json({ access_token, payloadClient });
    } catch (error) {
      next(error);
    }
  }

  static async findUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id).exec();
      if (!user) throw { name: 'NotFound' };

      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async editUser(req, res, next) {
    try {
      const id = req.user.id;
      const userId = req.params.id;
      let payload;

      if (id.toString() !== userId.toString()) throw { name: 'Forbidden' };

      if (req.body.imgUrl !== `[object Object]`) {
        payload = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          phoneNumber: req.body.phoneNumber,
          city: req.body.city,
          header: req.body.header,
          imgUrl: req.body.imgUrl,
        };
      } else {
        payload = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          phoneNumber: req.body.phoneNumber,
          city: req.body.city,
          header: req.body.header,
          // imgUrl : req.body.imgUrl
        };
      }

      if (!payload.firstName || !payload.lastName || !payload.username || !payload.phoneNumber || !payload.city) {
        throw { name: 'EditInput' };
      }
      const user = await userModel.findOne({ _id: id });

      if (!user) throw { name: 'NotFound' };

      await userModel.updateOne(
        { _id: id },
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
      );

      const updatedUser = await userModel.findOne({ _id: id }).exec();

      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      if (id !== userId.toString()) throw { name: 'Forbidden' };

      const deletedUser = await userModel.findById(id).exec();
      if (!deletedUser) throw { name: 'NotFound' };

      await userModel.deleteOne({ _id: id });
      await postModel.deleteMany({ userId });

      res.status(200).json(`The following user has been deleted: ${deletedUser.email}`);
    } catch (err) {
      next(err);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { idToken } = req.body;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT,
      });

      const payload = ticket.getPayload();
      let payloadJWT;
      let access_token;
      let payloadUser;

      const user = await userModel.findOne({ email: payload.email });
      if (user) {
        console.log("masuk if");
        payloadJWT = { email: user.email };

        payloadUser = {
          email: user.email,
          _id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
        };

        if (user.imgUrl) payloadUser.imgUrl = user.imgUrl;
        if (user.header) payloadUser.header = user.header;

        access_token = jwt.sign(payloadJWT, secretKey);
        res.status(200).json({ access_token, payloadUser });
      } else {
        console.log("masuk else");
        console.log(payload);
        const username = payload.name.replace(' ', '_');
        payloadJWT = { email: payload.email };
        const payloadCreate = {
          firstName: payload.given_name,
          lastName: payload.family_name || payload.given_name,
          email: payload.email,
          password: '12345',
          username,
          phoneNumber: '+62',
          city: '-',
          imgUrl: payload.picture,
        };

        payloadUser = await userModel.create(payloadCreate);
        payloadJWT = { email: payloadUser.email };
        access_token = jwt.sign(payloadJWT, secretKey);

        console.log(payloadUser, 'HALOOOOOOOOOOOOOOO');
        res.status(201).json({ payloadUser, access_token });
      }
    } catch (err) {
      console.log(err, "INI ERROR ===");
      next(err);
    }
  }
}

module.exports = User;
