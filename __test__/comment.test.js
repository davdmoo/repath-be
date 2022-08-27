const app = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const postModel = require('../models/postModel');
const userModel = require('../models/userModel.js');
const { ObjectId } = require('mongodb');

let access_token;
let access_token_one;
let payload;
let payload_one
let thePost;
let comment;

beforeAll(async () => {
    await userModel.deleteOne({   email: "test@mail.com" })
    await userModel.deleteOne({   email: "testii@mail.com" })

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
        firstName: "testii",
        lastName: "testii",
        email: "testii@mail.com",
        password: "12345",
        username: "testii",
        city: "testii",
        phoneNumber :"1234455"
    }

    const user = await userModel.create(userPayload)
    const payloadJwt = { email: user.email };
    access_token = jwt.sign(payloadJwt, "repathkeren");

    const userOne = await userModel.create(userPayloadOne)
    const payloadJwtOne = { email: userOne.email };
    access_token_one = jwt.sign(payloadJwtOne, "repathkeren");
    
    await postModel.deleteOne({  title: "text 1" })
    payload = {
        type : "text",
        userId: user._id,
        title: "text 1"
    }

    payload_one = {
        type : "text",
        userId: userOne._id,
        title: "text 1"
    } 

    thePost = await postModel.create(payload)
}, 10000)

afterAll(async()=>{
    mongoose.disconnect()
})

describe("POST /comments", () => {
    test("user failed to make a comment cause no access token", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/comments/${postId}`)
        .set('access_token', null)
        .send({
            userId: payload.userId,
            content: "haloo"
        })
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

    test("user succes to make a comment with access token", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/comments/${postId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo"
        })
        .then((resp) => {
            comment = resp.body
            const result = resp.body
            expect(resp.statusCode).toBe(201)
            expect(resp.res.statusMessage).toMatch("Created")
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
    
    test("user failed to make a comment due to unexisting post", (done) => {
        let postId = thePost._id.toString().slice(2, 0)
        request(app)
        .post(`/comments/${postId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo"
        })
        .then((resp) => {
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
})

describe("GET /comments", () => {
    test("user cannot access comment section", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .get(`/comments/${postId}`)
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

    test("user cannot access comment section due to unexisting post", (done) => {
        let postId = thePost._id.toString().slice(2, 0)
        request(app)
        .get(`/comments/${postId}`)
        .set('access_token', access_token)
        .then((resp) => {
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user can access and see comment section", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .get(`/comments/${postId}`)
        .set('access_token', access_token)
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(200)
            expect(result).toEqual(expect.arrayContaining(result))
            done()
        })
        .catch((err)=> {
            done(err)
        })
    })

    // test("user can access and see certain comment", (done) => {
    //     let commentId = "randomstring"
    //     request(app)
    //     .get(`/comments/${commentId}`)
    //     .set('access_token', access_token)
    //     .then((resp) => {
    //         const result = resp.body
    //         expect(resp.statusCode).toBe(404)
    //         // expect(result).toEqual(expect.arrayContaining(result))
    //         done()
    //     })
    //     .catch((err)=> {
    //         done(err)
    //     })
    // })

    // test("user can access and see certain comment", (done) => {
    //     let commentId = comment._id.toString()
    //     request(app)
    //     .get(`/comments/${commentId}`)
    //     .set('access_token', access_token)
    //     .then((resp) => {
    //         const result = resp.body
    //         expect(resp.statusCode).toBe(200)
    //         expect(result).toEqual(expect.arrayContaining(result))
    //         done()
    //     })
    //     .catch((err)=> {
    //         done(err)
    //     })
    // })

    test("user cannot access certain comment due to unexisting comment", (done) => {
        let commentId = comment._id.toString().slice(2, 0)
        request(app)
        .get(`/comments/${commentId}`)
        .set('access_token', access_token)
        .then((resp) => {
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            done()
        })
        .catch((err) => {
            done(err)
        })
    })
})

describe("PUT /comments", () => {
    test("user succes to edit a comment with access token", (done) => {
        let commentId = comment._id.toString()
        request(app)
        .put(`/comments/${commentId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo ini edit comment"
        })
        .then((resp) => {
            const result = resp.body
            expect(resp.statusCode).toBe(200)
            expect(resp.res.statusMessage).toMatch("OK")
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

    test("user failed to edit a comment due to unexisting comment", (done) => {
        let commentId = comment._id.toString().slice(2, 0)
        request(app)
        .put(`/comments/${commentId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo ini edit comment"
        })
        .then((resp) => {
            expect(resp.status).toBe(404)
            expect(resp.res.statusMessage).toMatch("Not Found")
            done()
        })
        .catch((err) => {
            done(err)
        })
    })

    test("user failed to edit a comment with access token", (done) => {
        let commentId = comment._id.toString()
        request(app)
        .put(`/comments/${commentId}`)
        .set('access_token', null)
        .send({
            content: "haloo ini edit comment"
        })
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

describe("DELETE /comments", () => {
    // test("user success to delete a comment", (done) => {
    //     let commentId = comment._id.toString()
    //     request(app)
    //     .delete(`/comments/${commentId}`)
    //     .set('access_token', access_token)
    //     .then((resp) => {
    //         const result = resp.body
    //         expect(resp.statusCode).toBe(200)
    //         expect(resp.res.statusMessage).toMatch("OK")
    //         done()
    //     })
    //     .catch((err) => {
    //         done(err)
    //     })
    // })

    test("user fails to delete a comment due to different user", (done) => {
        let commentId = comment._id.toString();
        
        request(app)
        .delete(`/comments/${commentId}`)
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

    test("user fail to delete a comment", (done) => {
        let commentId = comment._id.toString()
        request(app)
        .delete(`/comments/${commentId}`)
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

    test("user success to delete a comment", (done) => {
        let commentId = comment._id.toString()
        request(app)
        .delete(`/comments/${commentId}`)
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