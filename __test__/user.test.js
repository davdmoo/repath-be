const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');

beforeAll(async () => {
    await userModel.deleteOne({   email: "test2@mail.com" })
});

afterAll(async()=>{
   await  mongoose.disconnect()
})

// describe("GET /users", () => {
//     describe("when user have access token", () => {
       
//     })

//     describe("when user dont have access token", () => {

//     })
// })

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
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message')
            
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed no input", (done) => {
        request(app)
         .post('/users/register')
        .send({})
        .then((resp)=>{
            const result = resp.body
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message')
            
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
            console.log(result, `<<<<< NANI ERROR`)
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