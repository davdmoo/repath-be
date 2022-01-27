const postModel = require('../models/postModel');
const likeModel = require('../models/likesModel');
const friendModel = require('../models/friendModel');
const userModel = require('../models/userModel');
const commentModel = require('../models/commentModel');
const { ObjectId } = require('mongodb');

class Post {
  static async findPosts(req, res, next) {
    try {
      const { id } = req.user;
      let filter = [id];
      const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;

      const friends = await friendModel.find({ status: true }).populate([{ path: 'sender' }, { path: 'receiver' }]);

      let payload = [];

      friends.forEach((el) => {
        if (el.sender._id.toString() == id.toString()) {
          filter.push(el.receiver._id);
          payload.push(el.receiver);
        } else if (el.receiver._id.toString() == id.toString()) {
          filter.push(el.sender._id);
          payload.push(el.sender);
        }
      });

      const posts = await postModel
        .find({ userId: filter }, undefined, { skip, limit: 6 })
        .sort({ created_at: -1 })
        .populate([{ path: 'likes', populate: 'userId' }, { path: 'comments', populate: 'userId' }, { path: 'userId' }]);

      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }

  static async addPost(req, res, next) {
    try {
      const { type, text, imgUrl, location, title, artist, imageAlbum, albumName } = req.body;
      const userId = req.user.id;
      let payload = {
        type,
        userId,
      };

      if (!type) throw { name: 'NoType' };

      if (type === 'text' && text) {
        payload.text = text;
        payload.imgUrl = imgUrl;
      } else if (type === 'location' && location) {
        payload.location = location;
      } else if (type === 'music' && title) {
        payload.title = title;
        payload.artist = artist;
        payload.imageAlbum = imageAlbum;
        payload.albumName = albumName;
      } else {
        throw { name: 'NoInput' };
      }

      const newPost = await postModel.create(payload);

      await userModel.findOneAndUpdate(
        { _id: userId },
        {
          $push: {
            posts: newPost,
          },
        }
      );

      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }

  static async findPostByLikes(req, res, next) {
    try {
      const { id } = req.user;
      let payload = [];
      const likedPosts = await likeModel
        .find({ userId: id })
        .populate({
          path: 'postId',
          populate: {
            path: 'userId',
          },
        })
        .sort({ created_at: -1 });
      // console.log(likedPosts);
      let apus = '[object Object]';
      likedPosts.forEach((el) => {
        if (el.postId.imgUrl == apus) {
          let temp = {
            _id: el.postId._id,
            type: el.postId.type,
            text: el.postId.text,
            userId: el.postId.userId,
            created_at: el.postId.created_at,
            updatedAt: el.postId.updatedAt,
          };
          return payload.push(temp);
        }
        payload.push(el.postId);
      });

      res.status(200).json(payload);
    } catch (err) {
      next(err);
    }
  }

  static async editPost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await postModel.findById(id);
      if (!post) throw { name: 'NotFound' };

      if (post.userId.toString() !== userId.toString()) throw { name: 'Forbidden' };

      await postModel.updateOne({ _id: id }, req.body);
      const updatedPost = await postModel.findById(id).exec();

      res.status(200).json(updatedPost);
    } catch (err) {
      next(err);
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const post = await postModel.findById(id).exec();
      if (!post) throw { name: 'NotFound' };

      if (post.userId.toString() !== userId.toString()) throw { name: 'Forbidden' };

      await postModel.deleteOne({ _id: id });
      await commentModel.deleteMany({ postId: id });
      await likeModel.deleteMany({ postId: id });

      res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  }

  static async findPostsAll(req, res, next) {
    try {
      const { id } = req.user;
      let filter = [id];
      const skip = req.query.skip && /^\d+$/.test(req.query.skip) ? Number(req.query.skip) : 0;

      const friends = await friendModel.find({ status: true }).populate([{ path: 'sender' }, { path: 'receiver' }]);

      let payload = [];

      friends.forEach((el) => {
        if (el.sender._id.toString() == id.toString()) {
          filter.push(el.receiver._id);
          payload.push(el.receiver);
        } else if (el.receiver._id.toString() == id.toString()) {
          filter.push(el.sender._id);
          payload.push(el.sender);
        }
      });

      let filterFind;
      if (skip) (filterFind = { userId: filter }), undefined, { skip, limit };
      else filterFind = { userId: filter };

      const posts = await postModel
        .find(filterFind)
        .sort({ created_at: -1 })
        .populate([{ path: 'likes', populate: 'userId' }, { path: 'comments', populate: 'userId' }, { path: 'userId' }]);

      res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Post;
