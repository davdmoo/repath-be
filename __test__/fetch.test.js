const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");

let access_token 
beforeAll(async () => {
    await userModel.deleteOne({   email: "testfetch@mail.com" })

    const userPayload = {
        firstName: "testfetch",
        lastName: "testfetch",
        email: "testfetch@mail.com",
        password: "12345",
        username: "testfetch",
        city: "testfetch",
        phoneNumber :"123455"
    }


    const user = await userModel.create(userPayload)
    const jwtPayload = { email: user.email };
    access_token = jwt.sign(jwtPayload, "repathkeren")
});

afterAll(async()=>{
    await  mongoose.disconnect()
 })

 describe("POST /fetchs/ musics", () => {
    test("success get all music with access token", (done) => {
        request(app)
        .post('/fetchs/musics')
        .set('access_token',access_token)
        .send({ title : 'Bruno'})
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Array))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    }, 10000)


    test("failed to get all music without access token", (done) => {
        request(app)
        .post('/fetchs/musics')
        .send({ title : 'Bruno'})
        .then((resp)=>{
            const result = resp.body
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

describe("POST /fetchs/locations", () => {
    test("success get all locations with access token", (done) => {
        request(app)
        .post('/fetchs/locations')
        .set('access_token',access_token)
        .send({ location : 'Jakarta'})
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

    test("failed get all locations without access token", (done) => {
        request(app)
        .post('/fetchs/locations')
        .send({ location : 'Jakarta'})
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Access token not found')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("success get all locations with access token", (done) => {
        request(app)
        .post('/fetchs/locations')
        .set('access_token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RmZXRjaEBtYWlsLmNvbSIsImlhdCI6MTY0MzE2NjUxNn0.daJNOZv_ANYS24moOfUjNoGyA1-d2LUs1unuyGkHb")
        .send({ location : 'Jakarta'})
        .then((resp)=>{
            const result = resp.body
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Invalid token')
            
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })
    
})