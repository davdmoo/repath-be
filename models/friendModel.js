const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: Boolean
})

const friendModel = mongoose.model("Friend", friendSchema)

module.exports = friendModel
