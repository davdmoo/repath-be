require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const errorHandler = require("./middlewares/errorHandler")

const mongoDB = 'mongodb://localhost:27017/mongose'
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if(err){
        console.log(err)
    }else{
        console.log("connected")
    }
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/users', userRoutes)
app.use('/posts', postRoutes)

app.use(errorHandler)

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})
