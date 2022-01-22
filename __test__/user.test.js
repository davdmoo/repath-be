const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");

let access_token_one
let access_token_two 
let user_one

beforeAll(async () => {
    await userModel.deleteOne({   email: "test2@mail.com" })
    await userModel.deleteOne({   email: "test4@mail.com" })
    await userModel.deleteOne({   email: "test5@mail.com" })

    const userPayloadOne = {
        firstName: "test4",
        lastName: "test4",
        email: "test4@mail.com",
        password: "12345",
        username: "test4",
        city: "test4",
        phoneNumber :"1234455"
    }

    const userPayloadTwo = {
        firstName: "test5",
        lastName: "test5",
        email: "test5@mail.com",
        password: "12345",
        username: "test5",
        city: "test5",
        phoneNumber :"1234455"
    }


    user_one = await userModel.create(userPayloadOne)
    const payloadJWT_ONE = { email: user_one.email };
    access_token_one = jwt.sign(payloadJWT_ONE, "repathkeren");

    const user_two = await userModel.create(userPayloadTwo)
    const payloadJWT_TWO = { email: user_two.email };
    access_token_two = jwt.sign(payloadJWT_TWO, "repathkeren");
    // console.log(access_token_one, `1111111111111111111111111111`)
    // console.log(access_token_two, `2222222222222222222222222221`)
});


afterAll(async()=>{
   await  mongoose.disconnect()
})

describe("GET /users", () => {
    test("success get all user", (done) => {
        request(app)
        .get('/users')
        .set('access_token',access_token_one)
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
            // console.log(result, '+++++++ WHAT IS THIS+++++++')
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
            username: "testagnes",
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
            email: "testagnes@mail.com",
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
            lastName: "testagnes",
            email: "testagnes@mail.com",
            password: "12345",
            username: "testagnes",
            city: "testagnes",
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
            firstName: "testagnes",
            email: "testagnes@mail.com",
            password: "12345",
            username: "testagnes",
            city: "testagnes",
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
            firstName: "testagnes",
            lastName: "testagnes",
            password: "12345",
            username: "testagnes",
            city: "testagnes",
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
            firstName: "testagnes",
            lastName: "testagnes",
            email: "testagnes@mail.com",
            username: "test2",
            city: "testagnes",
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
            firstName: "testagnes",
            lastName: "testagnes",
            email: "testagnes@mail.com",
            password: "12345",
            city: "testagnes",
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
            firstName: "testagnes",
            lastName: "testagnes",
            email: "testagnes@mail.com",
            password: "12345",
            username: "testagnes",
            city: "testagnes",
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
            firstName: "testagnes",
            lastName: "testagnes",
            email: "testagnes@mail.com",
            password: "12345",
            username: "testagnes",
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

describe("DELETE /users", () =>{
   
        test("success delete own account", (done) => {
            const user_one_id = user_one._id.toString()
            request(app)
            .delete(`/users/${user_one_id}`)
            .set('access_token',access_token_one)
            .then((resp)=>{
                const result = resp.body
                expect(resp.status).toBe(200)
                expect(result).toEqual(expect.any(Array))
                expect(result[0]).toEqual(expect.any(Object))
                console.log(result,`NANIIIII`)
                done()
            })
            .catch((err)=>{
                done(err)
            })
        })
    

        test("failed delete others account", (done) => {
            const user_one_id = user_one._id.toString()
            request(app)
            .delete(`/users/${user_one_id}`)
            .set('access_token',access_token_two)
            .then((resp)=>{
                const result = resp.body
                expect(resp.status).toBe(403)
                expect(result).toEqual(expect.any(Object))
                expect(result).toHaveProperty('message', "you cannot delete other user")
                console.log(result,`NANIIIII`)
                done()
            })
            .catch((err)=>{
                done(err)
            })
        })
})