const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");
const friendModel = require('../models/friendModel');

let access_token_one
let access_token_two
let access_token_three 
let user_one
let user_two
let user_three
let request_one

beforeAll(async () => {
    await userModel.deleteOne({   email: "testuser@mail.com" })
    await userModel.deleteOne({   email: "testuser2@mail.com" })
    await userModel.deleteOne({   email: "testuser3@mail.com" })
    await userModel.deleteOne({   email: "testuser4@mail.com" })
    // await friendModel.deleteOne({ _id: request_one._id.toString() })

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
    access_token_three = jwt.sign(payloadJWT_THREE, "repathkeren");
});

afterAll(async()=>{
   await  mongoose.disconnect()
})


describe("POST /friends", () => {
    test("success send friend request", (done) => {
        const userId = user_two._id.toString()
        request(app)
        .post(`/friends/${userId}`)
        .set({
            access_token: access_token_one
        })
        .then((resp)=>{
            const result = resp.body
            request_one = result
            expect(resp.status).toBe(201)
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed send friend request", (done) => {
        const userId = user_two._id.toString()
        request(app)
        .post(`/friends/${userId}`)
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

describe("PATCH /friends", () => {
    test("failed accepting friend request as a sender 403", (done) => {
        const reqId = request_one._id;
        request(app)
        .patch(`/friends/${reqId}`)
        .set({
            access_token: access_token_one
        })
          .then((resp) => {
              const { body, status } = resp;
              expect(status).toBe(403);
              expect(body).toEqual(expect.any(Object));
              expect(body).toHaveProperty("message", "Forbidden access");

              done();
          })
          .catch((err) => {
              done(err);
          })
    })

    test("success acc friend request", (done) => {
        const reqId = request_one._id
        request(app)
        .patch(`/friends/${reqId}`)
        .set({
            access_token: access_token_two
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    // test("failed acc unexisting friend request", (done) => {
    //     const reqId = request_one._id
    //     request(app)
    //     .patch(`/friends/${reqId}`)
    //     .set({
    //         access_token: access_token_three
    //     })
    //     .then((resp)=>{
    //         const result = resp.body
    //         console.log(result, "ASDasdasdasd");
            // expect(resp.status).toBe(403)
            // expect(resp.res.statusMessage).toMatch("Forbidden")
            // expect(result).toEqual({message: 'Forbidden access'})
    //         done()
    //     })
    //     .catch((err)=>{
    //         done(err)
    //     })
    // })
})

describe("GET /friends", () => {
    test("success fetching friends", (done) => {
        request(app)
        .get('/friends')
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

    test("sucsess fetching request friends", (done) => {
        request(app)
        .get('/friends/requests')
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

    test("failed fetching request friends", (done) => {
        request(app)
        .get('/friends/request')
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

    test("failed fetching friends", (done) => {
        request(app)
        .get('/friends')
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

describe("DELETE /friends", () => {
    test("failed decline friend request", (done) => {
        const reqId = request_one._id
        request(app)
        .delete(`/friends/${reqId}`)
        .set({
            access_token: access_token_three
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(403)
            expect(resp.res.statusMessage).toMatch("Forbidden")
            expect(result).toEqual({message: 'Forbidden access'})
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("success decline friend request", (done) => {
        const reqId = request_one._id
        request(app)
        .delete(`/friends/${reqId}`)
        .set({
            access_token: access_token_one
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("fail decline/delete friend request not found", (done) => {
        const reqId = request_one._id
        request(app)
        .delete(`/friends/${reqId}`)
        .set({
            access_token: access_token_one
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(404)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty("message", "Content not found")
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})