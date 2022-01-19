const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  content: String
});

const commentModel = mongoose.model("Comment", commentSchema);

module.exports = commentModel;
