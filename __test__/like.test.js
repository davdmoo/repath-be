const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const { ObjectId } = require("mongodb");

let access_token;
let thePost;
let payload;
let like;

beforeAll(async () => {
    await userModel.deleteOne({   email: "test@mail.com" })
   
    const userPayload = {
        firstName: "test",
        lastName: "test",
        email: "test@mail.com",
        password: "12345",
        username: "test",
        city: "test",
        phoneNumber :"1234455"
    }
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
    console.log(thePost._id.toString(), "<<<<<<<<<<<<<<<<<");
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
            console.log(result);
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
})

describe("POST /likes", () =>{
    test("user succes to make a likes with access token", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/likes/${postId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo"
        })
        .then((resp) => {
            const result = resp.body
            console.log(result, "INI RESULT<<<<<<<<<<<<<<<<<<<<<<<<<<");
            like = result
            expect(resp.statusCode).toBe(201)
            expect(resp.res.statusMessage).toMatch("Created")
            // expect(result).objectContaining({
            //     userId: expect.any(String),
            //     content: expect.any(String),
            //     _id: expect.any(String)
            // })
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
        .send({
            userId: payload.userId,
            content: "haloo"
        })
        .then((resp) => {
            const result = resp.body
            // console.log(resp, "=========<<<<<<");
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
    test("user success to delete a likes", (done) => {
        let postId = thePost._id.toString()
        let likeId = like._id.toString()
        request(app)
        .delete(`/likes/${postId}/${likeId}`)
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

    test("user success to delete a likes", (done) => {
        let postId = thePost._id.toString()
        console.log(like, "INIIII LIKEEEE");
        let likeId = like._id.toString()
        request(app)
        .delete(`/likes/${postId}/${likeId}`)
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