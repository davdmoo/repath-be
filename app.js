require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes')
const followRoutes = require('./routes/followRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const likesRoutes = require('./routes/likesRoutes')
const errorHandler = require("./middlewares/errorHandler");
const fetchRoutes = require('./routes/fetchroutes')
const cors = require("cors");
const mongoConnection = require("./config/monggoConfig");

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/likes', likesRoutes)
app.use('/follows', followRoutes)
app.use('/fetchs', fetchRoutes)

app.use(errorHandler)

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`)
})

module.exports = app