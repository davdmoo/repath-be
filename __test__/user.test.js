const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");

let access_token
beforeAll(async () => {
    await userModel.deleteOne({   email: "test2@mail.com" })
    await userModel.deleteOne({   email: "tes4@mail.com" })

    const userPayload = {
        firstName: "test4",
        lastName: "test4",
        email: "tes4@mail.com",
        password: "12345",
        username: "test4",
        city: "test4",
        phoneNumber :"1234455"
    }

    const user = await userModel.create(userPayload)

    const payloadJwt = { email: user.email };
    access_token = jwt.sign(payloadJwt, "repathkeren");
});

afterAll(async()=>{
   await  mongoose.disconnect()
})

describe("GET /users", () => {
    test("success get all user", (done) => {
        request(app)
        .get('/users')
        .set('access_token',access_token)
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

    test("failed no access_token", (done) => {
        request(app)
        .get('/users')
        .then((resp)=>{
            const result = resp.body
            console.log(result, '+++++++ WHAT IS THIS+++++++')
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Access token not found')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})

describe("POST /register", () =>{
    test("success register", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test",
            lastName: "test",
            email: "test2@mail.com",
            password: "12345",
            username: "test2",
            city: "test",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
         const result = resp.body
            expect(resp.status).toBe(201)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('_id')
            expect(result).toHaveProperty('email',"test2@mail.com")
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed not unique email", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test",
            lastName: "test",
            email: "test2@mail.com",
            password: "12345",
            username: "test3",
            city: "test",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message')
            
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed not unique username", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test",
            lastName: "test",
            email: "test3@mail.com",
            password: "12345",
            username: "test2",
            city: "test",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
            const result = resp.body 
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message')
            
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no firstname", (done) => {
        request(app)
         .post('/users/register')
        .send({     
            lastName: "test3",
            email: "test3@mail.com",
            password: "12345",
            username: "test3",
            city: "tes3",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message','Please input first name')
            
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no last name", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            email: "test3@mail.com",
            password: "12345",
            username: "test3",
            city: "tes3t",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
         const result = resp.body
         expect(resp.status).toBe(400)
         expect(result).toEqual(expect.any(Object))
         expect(result).toHaveProperty('message','Please input last name')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no email", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            lastName: "test3",
            password: "12345",
            username: "test3",
            city: "test3",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message','Please input email')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no password", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            lastName: "test3",
            email: "test3@mail.com",
            username: "test2",
            city: "test3",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
         const result = resp.body
         expect(resp.status).toBe(400)
         expect(result).toEqual(expect.any(Object))
         expect(result).toHaveProperty('message','Please input password')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no username", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            lastName: "test3",
            email: "test3@mail.com",
            password: "12345",
            city: "test3",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message','Please input username')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no phonenumber", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            lastName: "test3",
            email: "test3@mail.com",
            password: "12345",
            username: "test3",
            city: "test3",
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message','Please input phone number')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no city", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test3",
            lastName: "test3",
            email: "test3@mail.com",
            password: "12345",
            username: "test3",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
          const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message','Please input city')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})

describe("POST /login", () =>{
    test("success login", (done) => {
        request(app)
         .post('/users/login')
        .send({
            email: "test2@mail.com",
            password: "12345",
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('access_token')
    
          
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed wrong password", (done) => {
        request(app)
         .post('/users/login')
        .send({
            email: "test2@mail.com",
            password: "1234",
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Invalid email/password')
         
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })


    test("failed no password", (done) => {
        request(app)
         .post('/users/login')
        .send({
            email: "test2@mail.com",
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', "Password is required")
    
          
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no email", (done) => {
        request(app)
         .post('/users/login')
        .send({
            password: "12345"
        })
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(400)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', "Email is required")
         
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})

// describe("DELETE /users", () =>{
//     describe("user wanted to delete own account", () => {

//     })

//     describe("user wanted to delete other account", () => {

//     })
// })