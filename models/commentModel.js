const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  {
    timestamps: { createdAt: 'created_at' },
  }
);

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
