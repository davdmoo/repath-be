const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");

let access_token_one
let access_token_two 
let user_one
let user_two
let user_three

beforeAll(async () => {
    await userModel.deleteOne({   email: "testuser@mail.com" })
    await userModel.deleteOne({   email: "testuser2@mail.com" })
    await userModel.deleteOne({   email: "testuser3@mail.com" })
    await userModel.deleteOne({   email: "testuser4@mail.com" })


    const userPayloadOne = {
        firstName: "testuser2",
        lastName: "testuser2",
        email: "testuser2@mail.com",
        password: "12345",
        username: "testuser2",
        city: "testuser2",
        phoneNumber :"1234455"
    }

    const userPayloadTwo = {
        firstName: "testuser3",
        lastName: "testuser3",
        email: "testuser3@mail.com",
        password: "12345",
        username: "testuser3",
        city: "testuser3",
        phoneNumber :"1234455"
    }


    const userPayloadThree = {
        firstName: "testuser4",
        lastName: "testuser4",
        email: "testuser4@mail.com",
        password: "12345",
        username: "testuser4",
        city: "testuser4",
        phoneNumber :"1234455"
    }


    user_one = await userModel.create(userPayloadOne)
    const payloadJWT_ONE = { email: user_one.email };
    access_token_one = jwt.sign(payloadJWT_ONE, "repathkeren");

    user_two = await userModel.create(userPayloadTwo)
    const payloadJWT_TWO = { email: user_two.email };
    access_token_two = jwt.sign(payloadJWT_TWO, "repathkeren");
  
    user_three = await userModel.create(userPayloadThree)
    const payloadJWT_THREE = { email: user_three.email };
    access_token_two = jwt.sign(payloadJWT_THREE, "repathkeren");
});

afterAll(async()=>{
   await  mongoose.disconnect()
})

describe("GET /follows", () => {
    test("success fetching following", (done) => {
        request(app)
        .get('/follows')
        .set({
            access_token: access_token_one
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Array))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed fetching following", (done) => {
        request(app)
        .get('/follows')
        .set({
            access_token: null
        })
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
})

describe("POST /follows", () => {

})

describe("DELETE /follows", () => {

})