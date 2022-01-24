// const userModel = require('../models/userModel');
// const request = require('supertest');
// const app = require('../app.js')
// const mongoose = require('../config/monggoConfig');
// const jwt = require("jsonwebtoken");

// let access_token_one
// let access_token_two 
// let user_one
// let user_two
// let user_three

// beforeAll(async () => {
//     await userModel.deleteOne({   email: "testuser@mail.com" })
//     await userModel.deleteOne({   email: "testuser2@mail.com" })
//     await userModel.deleteOne({   email: "testuser3@mail.com" })
//     await userModel.deleteOne({   email: "testuser4@mail.com" })


//     const userPayloadOne = {
//         firstName: "testuser2",
//         lastName: "testuser2",
//         email: "testuser2@mail.com",
//         password: "12345",
//         username: "testuser2",
//         city: "testuser2",
//         phoneNumber :"1234455"
//     }

//     const userPayloadTwo = {
//         firstName: "testuser3",
//         lastName: "testuser3",
//         email: "testuser3@mail.com",
//         password: "12345",
//         username: "testuser3",
//         city: "testuser3",
//         phoneNumber :"1234455"
//     }


//     const userPayloadThree = {
//         firstName: "testuser4",
//         lastName: "testuser4",
//         email: "testuser4@mail.com",
//         password: "12345",
//         username: "testuser4",
//         city: "testuser4",
//         phoneNumber :"1234455"
//     }


//     user_one = await userModel.create(userPayloadOne)
//     const payloadJWT_ONE = { email: user_one.email };
//     access_token_one = jwt.sign(payloadJWT_ONE, "repathkeren");

//     user_two = await userModel.create(userPayloadTwo)
//     const payloadJWT_TWO = { email: user_two.email };
//     access_token_two = jwt.sign(payloadJWT_TWO, "repathkeren");
  
//     user_three = await userModel.create(userPayloadThree)
//     const payloadJWT_THREE = { email: user_three.email };
//     access_token_two = jwt.sign(payloadJWT_THREE, "repathkeren");
// });

// afterAll(async()=>{
//    await  mongoose.disconnect()
// })

// describe("GET /follows", () => {
//     test("success fetching following", (done) => {
//         request(app)
//         .get('/follows')
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.status).toBe(200)
//             expect(result).toEqual(expect.any(Array))
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed fetching following", (done) => {
//         request(app)
//         .get('/follows')
//         .set({
//             access_token: null
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.statusCode).toBe(401)
//             expect(resp.res.statusMessage).toMatch("Unauthorized")
//             expect(result).toMatchObject({"message": 'Invalid token'})
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })
// })

// describe("POST /follows", () => {
//     test("success add following", (done) => {
//         const userId = user_two._id.toString()
//         request(app)
//         .post(`/follows/${userId}`)
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.status).toBe(201)
//             expect(result).toEqual(expect.any(Object))
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed add following", (done) => {
//         const userId = user_two._id.toString()
//         request(app)
//         .post(`/follows/${userId}`)
//         .set({
//             access_token: null
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.statusCode).toBe(401)
//             expect(resp.res.statusMessage).toMatch("Unauthorized")
//             expect(result).toMatchObject({"message": 'Invalid token'})
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed add existing following", (done) => {
//         const userId = user_two._id.toString()
//         request(app)
//         .post(`/follows/${userId}`)
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.statusCode).toBe(403)
//             expect(resp.res.statusMessage).toMatch("Forbidden")
//             expect(result).toBe("you already follow this user")
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed add following own user", (done) => {
//         const userId = user_one._id.toString()
//         request(app)
//         .post(`/follows/${userId}`)
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.statusCode).toBe(403)
//             expect(resp.res.statusMessage).toMatch("Forbidden")
//             expect(result).toBe("you cannot follow yourself")
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })
// })

// describe("DELETE /follows", () => {
//     test("success delete following", (done) => {
//         const userId = user_two._id.toString()
//         request(app)
//         .delete(`/follows/${userId}`)
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.status).toBe(201)
//             expect(result).toEqual(expect.any(Object))
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed delete unexisting following", (done) => {
//         const userId = user_three._id.toString()
//         request(app)
//         .delete(`/follows/${userId}`)
//         .set({
//             access_token: access_token_one
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.status).toBe(400)
//             expect(resp.res.statusMessage).toMatch("Bad Request")
//             expect(result).toEqual({message: 'Content not found'})
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })

//     test("failed delete following", (done) => {
//         const userId = user_two._id.toString()
//         request(app)
//         .delete(`/follows/${userId}`)
//         .set({
//             access_token: null
//         })
//         .then((resp)=>{
//             const result = resp.body
//             expect(resp.statusCode).toBe(401)
//             expect(resp.res.statusMessage).toMatch("Unauthorized")
//             expect(result).toMatchObject({"message": 'Invalid token'})
//             done()
//         })
//         .catch((err)=>{
//             done(err)
//         })
//     })
// })