const mongoose = require('mongoose');
const { Schema } = mongoose;

const followSchema = new mongoose.Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{ strict: true })

const followModel = mongoose.model("Follow", followSchema)

module.exports = followModel
