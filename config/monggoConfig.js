require("dotenv").config();
const mongoose = require('mongoose');

let mongoDB
if(process.env.NODE_ENV === "test") mongoDB = process.env.MONGO_URI_TEST
else mongoDB = process.env.MONGO_URI

console.log(mongoDB, `AAAAAAAAAA`)
console.log(process.env.NODE_ENV, `<<<<<<<<<<<<<<<<<<<NODE`)
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err) {
        console.log(err)
    } else {
        console.log("connected")
    }
})

module.exports = mongoose