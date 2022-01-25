const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const { ObjectId } = require("mongodb");

let access_token;
let access_token_one;
let user_one
let thePost;
let payload;
let like;

beforeAll(async () => {
    await userModel.deleteOne({   email: "test@mail.com" })
    await userModel.deleteOne({   email: "testuser8@mail.com" })

    const userPayload = {
        firstName: "test",
        lastName: "test",
        email: "test@mail.com",
        password: "12345",
        username: "test",
        city: "test",
        phoneNumber :"1234455"
    }

    const userPayloadOne = {
        firstName: "testuser28",
        lastName: "testuser28",
        email: "testuser8@mail.com",
        password: "12345",
        username: "testuser28",
        city: "testuser24",
        phoneNumber :"1234455"
    }
    user_one = await userModel.create(userPayloadOne)
    const payloadJWT_ONE = { email: user_one.email };
    access_token_one = jwt.sign(payloadJWT_ONE, "repathkeren");

    const user = await userModel.create(userPayload)
    const payloadJwt = { email: user.email };
    access_token = jwt.sign(payloadJwt, "repathkeren");
    
    await postModel.deleteOne({  title: "text 1" })
    payload = {
        type : "text",
        userId: user._id,
        title: "text 1"
    } 

    thePost = await postModel.create(payload)
});


afterAll(async()=>{
    await mongoose.disconnect()
})

describe("GET /likes", () => {
    test("user cannot access likes section", (done) => {
        const postId = thePost._id.toString()
        request(app)
        .get(`/likes/${postId}`)
        .set('access_token', null)
        .then((resp)=>{
            const result = resp.body
            expect(resp.statusCode).toBe(401)
            expect(resp.res.statusMessage).toMatch("Unauthorized")
            expect(result).toMatchObject({"message": 'Invalid token'})
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("user can access likes section", (done) => {
        const postId = thePost._id.toString()
        request(app)
        .get(`/likes/${postId}`)
        .set('access_token', access_token)
        .then((resp)=>{
            const result = resp.body
            expect(resp.statusCode).toBe(200)
            expect(result).toEqual(expect.arrayContaining(result))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed fetch likes section due post not found", (done) => {
        const postId = thePost._id.toString() + "123"
        request(app)
        .get(`/likes/${postId}`)
        .set('access_token', access_token)
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            expect(result).toEqual({message: 'Content not found'})
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("user can access likes section by userId", (done) => {
        // const userId = payload.userId.toString()
        request(app)
        .get(`/likes`)
        .set('access_token', access_token)
        .then((resp)=>{
            const result = resp.body
            expect(resp.statusCode).toBe(200)
            expect(result).toEqual(expect.arrayContaining(result))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed fetch likes section due userId not found", (done) => {
        const userId = payload.userId.toString() + "123"
        request(app)
        .get(`/likes/${userId}`)
        .set('access_token', access_token)
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            expect(result).toEqual({message: 'Content not found'})
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})

describe("POST /likes", () =>{
    test("user succes to make a likes with access token", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/likes/${postId}`)
        .set('access_token', access_token)
        .then((resp) => {
            const result = resp.body
            like = result
            expect(resp.statusCode).toBe(201)
            expect(resp.res.statusMessage).toMatch("Created")
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to make a likes due to existing likes", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/likes/${postId}`)
        .set('access_token', access_token)
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(400)
            expect(resp.res.statusMessage).toMatch("Bad Request")
            expect(result).toEqual({ message: 'You have liked this post before' })
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to make a likes due post not found", (done) => {
        let postId = thePost._id.toString().slice(2, 0)
        request(app)
        .post(`/likes/${postId}`)
        .set('access_token', access_token)
        .then((resp) => {
            expect(resp.res.statusCode).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            expect(resp.created).toEqual(false)
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to make a likes cause no access token", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/likes/${postId}`)
        .set('access_token', null)
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(401)
            expect(resp.res.statusMessage).toMatch("Unauthorized")
            expect(result).toMatchObject({"message": 'Invalid token'})
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
})

describe("DELETE /likes", () =>{
    test("user failed to delete a likes", (done) => {
        let likeId = like._id.toString()
        request(app)
        .delete(`/likes/${likeId}`)
        .set('access_token', null)
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(401)
            expect(resp.res.statusMessage).toMatch("Unauthorized")
            expect(result).toMatchObject({"message": 'Invalid token'})
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to make a likes due to different user", (done) => {
        let likeId = like._id.toString()
        request(app)
        .delete(`/likes/${likeId}`)
        .set('access_token', access_token_one)
        .then((resp) => {
            const result = resp.body
            expect(resp.status).toBe(403)
            expect(resp.res.statusMessage).toMatch("Forbidden")
            expect(result).toEqual({message: 'Forbidden access'})
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to make a likes due to like not found", (done) => {
        let likeId = like._id.toString().slice(2, 0)
        request(app)
        .delete(`/likes/${likeId}`)
        .set('access_token', access_token)
        .then((resp) => {
            expect(resp.res.statusCode).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            expect(resp.created).toEqual(false)
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user success to delete a likes", (done) => {
        let likeId = like._id.toString()
        request(app)
        .delete(`/likes/${likeId}`)
        .set('access_token', access_token)
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(200)
            expect(resp.res.statusMessage).toMatch("OK")
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
})

afterAll(async()=>{
    mongoose.disconnect()
})