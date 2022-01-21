const app = require('../app.js');
const request = require('supertest');
const mongoose = require('mongoose');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');

let access_token 

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

   
});

describe("GET /comments", () => {
    describe("when user have access token", () => {
        test("user cannot access comment section", (done) => {
            request(app)
            .get("/comments")
            expect(response.statusCode).toBe(403)
        })
    })

    describe("when user dont have access token", () => {
        test("user can access and see comment section", () => {
            const response = await request(app).get("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("POST /comments", () => {
    describe("user input is correct", () => {
        test("user success to make a comment", () => {
            const response = await request(app).post("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(201)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to make a comment", () => {
            const response = await request(app).post("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("PUT /comments", () => {
    describe("user input is correct", () => {
        test("user success to edit a comment", () => {
            const response = await request(app).put("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to edit a comment", () => {
            const response = await request(app).put("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("DELETE /comments", () => {
    describe("user wanted to delete own comment", () => {
        test("user success to delete a comment", () => {
            const response = await request(app).delete("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user wanted to delete other comment", () => {
        test("user success to delete a comment", () => {
            const response = await request(app).delete("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

afterAll(async()=>{
    mongoose.disconnect()
})