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
    let payload = {
        type : "text",
        userId: user._id,
        title: "text 1"
    } 

    await postModel.create(payload)

    thePost = await postModel.findOne({type: "text", title: "text 1"}).exec()
})

afterAll(async()=>{
    mongoose.disconnect()
})

describe("GET /comments", () => {
    const postId = ObjectId(thePost._id)
    describe("when user have access token", () => {
        test("user cannot access comment section", (done) => {
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
    })

    describe("when user dont have access token", () => {
        test("user can access and see comment section", (done) => {
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
})

// describe("POST /comments", () => {
//     describe("user input is correct", () => {
//         test("user success to make a comment", () => {
//             const response = await request(app).post("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(201)
//         })
//     })

//     describe("user input is incorrect", () => {
//         test("user failed to make a comment", () => {
//             const response = await request(app).post("/comments")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

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