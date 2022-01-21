const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('mongoose');

let access_token 

beforeAll(async () => {
    await userModel.deleteOne({   email: "test@mail.com" })
    console.log(process.env.NODE_ENV,`<<<<<<<<<<<<<<<<<<<<`)

    const userPayload = {
        firstName: "test",
        lastName: "test",
        email: "test@mail.com",
        password: "12345",
        username: "test"
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

describe("GET /likes", () => {
    describe("when user have access token", () => {
        test("user cannot access likes section", async () => {
            const response = await request(app).get("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(403)
        })
    })

    describe("when user dont have access token", () => {
        test("user can access and see likes section", async () => {
            const response = await request(app).get("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("POST /likes", () =>{
    describe("user input is correct", () => {
        test("user success to make a likes", async () => {
            const response = await request(app).post("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(201)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to make a likes", async () => {
            const response = await request(app).post("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("PUT /likes", () =>{
    describe("user input is correct", () => {
        test("user success to edit a likes", async () => {
            const response = await request(app).put("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to edit a likes", async () => {
            const response = await request(app).put("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("DELETE /likes", () =>{
    describe("user wanted to delete own post", () => {
        test("user success to delete a likes", async () => {
            const response = await request(app).delete("/likes")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user wanted to delete other post", () => {
        test("user success to delete a likes", async () => {
            const response = await request(app).delete("/likes")
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