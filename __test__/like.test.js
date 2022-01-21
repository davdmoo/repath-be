const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const userModel = require('../models/userModel');

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

    thePost = await postModel.create(payload)
   
});

describe("GET /likes", () => {
    describe("when user have access token", () => {
        test("user cannot access likes section", (done) => {
            request(app)
            .get('/likes')
            .set('access_token', null)
            .then((resp)=>{
            const result = resp.body
            //  console.log(result)
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Array))
                done()
            })
            .catch((err)=>{
                done(err)
            })
        })
    })

    describe("when user dont have access token", () => {
        test("user cannot access likes section", (done) => {
            request(app)
            .get('/likes')
            .set('access_token',access_token)
            .then((resp)=>{
            const result = resp.body
            //  console.log(result)
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Array))
                done()
            })
            .catch((err)=>{
                done(err)
            })
        })
    })
})

// describe("POST /likes", () =>{
//     describe("user input is correct", () => {
//         test("user success to make a likes", async () => {
//             const response = await request(app).post("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(201)
//         })
//     })

//     describe("user input is incorrect", () => {
//         test("user failed to make a likes", async () => {
//             const response = await request(app).post("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

// describe("PUT /likes", () =>{
//     describe("user input is correct", () => {
//         test("user success to edit a likes", async () => {
//             const response = await request(app).put("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })

//     describe("user input is incorrect", () => {
//         test("user failed to edit a likes", async () => {
//             const response = await request(app).put("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

// describe("DELETE /likes", () =>{
//     describe("user wanted to delete own post", () => {
//         test("user success to delete a likes", async () => {
//             const response = await request(app).delete("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })

//     describe("user wanted to delete other post", () => {
//         test("user success to delete a likes", async () => {
//             const response = await request(app).delete("/likes")
//             .send({
//                 access_token: null
//             })
//             expect(response.statusCode).toBe(200)
//         })
//     })
// })

afterAll(async()=>{
    mongoose.disconnect()
})