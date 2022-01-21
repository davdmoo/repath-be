const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const jwt = require("jsonwebtoken");
const mongoose = require('../config/monggoConfig');

let access_token;
let post;

beforeAll(async () => {
    await userModel.deleteOne({ email: "test3@mail.com" });
    await postModel.deleteOne({ text: "test1" });
   
    const userPayload = {
        firstName: "test",
        lastName: "test",
        email: "test3@mail.com",
        password: "12345",
        username: "test3",
        city: "test",
        phoneNumber :"1234455"
    }
    const user = await userModel.create(userPayload)
    const payloadJwt = { email: user.email };
    access_token = jwt.sign(payloadJwt, "repathkeren");
    
    await postModel.deleteOne().or([{ text: "text 1" }, { text: "text 2" }]);
    let payload = {
        type : "text",
        userId: user._id,
        text: "text 1"
    } 

    post = await postModel.create(payload);
});


describe("GET /posts", () => {
    test("when user have access token", (done) => {
        request(app)
        .get('/posts')
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
    
    test("when user dont have access token", (done) => {
        request(app)
        .get('/posts')
        .then((resp) => {
            const result = resp.body
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty("message", "Access token not found")
            done()
        })
        .catch(err => {
            done(err)
        })
    })
})

describe("POST /posts", () =>{
    describe("user input is correct", () => {
        test("success posting", (done) => {
            request(app)
            .post("/posts")
            .set('access_token', access_token)
            .send({
              type: "text",
              text: "test post"
            })
              .then((response) => {
                const result = response.body;
                expect(response.status).toBe(201);
                expect(result).toEqual(expect.any(Object));
                expect(result).toHaveProperty("text");

                done();
              })
              .catch((err) => {
                done(err);
              })
        })

        test("error posting no type", (done) => {
            request(app)
            .post("/posts")
            .set("access_token", access_token)
            .send({
              text: "test post"
            })
              .then((response) => {
                const { body, status } = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Please fill all input fields");

                done();
              })
              .catch((err) => {
                done(err);
              })
        })

        test("error posting no input", (done) => {
            request(app)
            .post("/posts")
            .set("access_token", access_token)
              .then((response) => {
                const { body, status } = response;
                expect(status).toBe(400);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("message", "Please fill all input fields");

                done();
              })
              .catch((err) => {
                done(err);
              });
        })
    })
    
    describe("user input is incorrect", () => {
        test("no access token", (done) => {
            request(app)
            .post("/posts")
            .send({
                type: "text1",
                text: "test post"
            })
                .then((response) => {
                  const result = response.body;
                  expect(response.status).toBe(401);
                  expect(result).toEqual(expect.any(Object));
                  expect(result).toHaveProperty("message", "Access token not found");
  
                  done();
                })
                .catch((err) => {
                    done(err);
                })
        })
    })
})

describe("PUT /posts", () =>{
    describe("user input is correct", () => {
        test("update success", (done) => {
            const postId = post._id;
            request(app)
            .put(`/posts/${postId}`)
            .set("access_token", access_token)
            .send({
                text: "text 2"
            })
              .then((response) => {
                const { body, status } = response;
                expect(status).toBe(200);
                expect(body).toEqual(expect.any(Object));
                expect(body).toHaveProperty("text");

                done();
              })
              .catch((err) => {
                done(err);
              });
        })
    })

    describe("user input is incorrect", () => {

    })
})
    
    // describe("DELETE /posts", () =>{
        //     describe("user wanted to delete own post", () => {
            
            //     })
            
            //     describe("user wanted to delete other post", () => {
                
                //     })
                // })
afterAll(async()=>{
      await  mongoose.disconnect()
})