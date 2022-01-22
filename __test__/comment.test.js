const app = require('../app.js');
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');
const userModel = require('../models/userModel.js');
const { ObjectId } = require('mongodb');

let access_token 
let thePost
let payload 
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
    // await postModel.findOne({type: "text", title: "text 1"}).exec()
})

afterAll(async()=>{
    mongoose.disconnect()
})

describe("GET /comments", () => {
    test("user cannot access comment section", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .get(`/comments/${postId}`)
        .set('access_token', null)
        .then((resp) => {
            const result = resp.body
            console.log(result);
            expect(resp.statusCode).toBe(401)
            expect(resp.res.statusMessage).toMatch("Unauthorized")
            expect(result).toMatchObject({"message": 'Invalid token'})
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
})

describe("POST /comments", () => {
    test("user failed to make a comment", (done) => {
        let postId = thePost._id.toString()
        console.log(postId, "=================");
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

    test("user succes to make a comment", (done) => {
        let postId = thePost._id.toString()
        request(app)
        .post(`/comments/${postId}`)
        .set('access_token', access_token)
        .send({
            content: "haloo"
        })
        .then((resp) => {
            const result = resp.body
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
    
})

// describe("PUT /comments", () => {
//     describe("user input is correct", () => {
//         test("user success to edit a comment", () => {
//             const response = await request(app).put("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })

//     describe("user input is incorrect", () => {
//         test("user failed to edit a comment", () => {
//             const response = await request(app).put("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

// describe("DELETE /comments", () => {
//     describe("user wanted to delete own comment", () => {
//         test("user success to delete a comment", () => {
//             const response = await request(app).delete("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })

//     describe("user wanted to delete other comment", () => {
//         test("user success to delete a comment", () => {
//             const response = await request(app).delete("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })