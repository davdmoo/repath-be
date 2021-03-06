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
const fetchRoutes = require('./routes/fetchroutes')
const cors = require("cors");
const mongoConnection = require("./config/monggoConfig");
const authentication = require("./middlewares/authentication");

app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/users', userRoutes)
app.use(authentication)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/likes', likesRoutes)
app.use('/friends', friendRoutes)
app.use('/fetchs', fetchRoutes)

app.use(errorHandler)

module.exports = app