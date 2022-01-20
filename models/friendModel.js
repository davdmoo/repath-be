const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendSchema = new mongoose.Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const friendModel = mongoose.model("Friend", friendSchema)

module.exports = friendModel
