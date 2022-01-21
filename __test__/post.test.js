const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const jwt = require("jsonwebtoken");
const mongoose = require('../config/monggoConfig');

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
    
    // describe("when user dont have access token", () => {
        
        // })
    })
    
    // describe("POST /posts", () =>{
        //     describe("user input is correct", () => {
            
            //     })
            
            //     describe("user input is incorrect", () => {
                
                //     })
                // })
                
                // describe("PUT /posts", () =>{
                    //     describe("user input is correct", () => {
                        
                        //     })
                        
//     describe("user input is incorrect", () => {
    
    //     })
    // })
    
    // describe("DELETE /posts", () =>{
        //     describe("user wanted to delete own post", () => {
            
            //     })
            
            //     describe("user wanted to delete other post", () => {
                
                //     })
                // })
afterAll(async()=>{
      await  mongoose.disconnect()
})