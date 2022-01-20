require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const friendRoutes = require('./routes/friendRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const likesRoutes = require('./routes/likesRoutes')
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");

const mongoDB = 'mongodb://localhost:27017'
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

app.use(authentication)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/likes', likesRoutes)
app.use('/friends', friendRoutes)

app.use(errorHandler)

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})
