const friends = require("mongoose-friends")

const friendSchema = new mongoose.Schema({

})

friendSchema.plugin(friends({index: false}));
const friendModel = mongoose.model("Friend", friendSchema)

module.exports = friendModel