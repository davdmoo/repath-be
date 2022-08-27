const request = require('supertest');
const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const app = require('../index.js')
const jwt = require("jsonwebtoken");
const mongoose = require('../config/monggoConfig');
const secretKey = process.env.SECRETKEY;
const axios = require('axios')
jest.mock('axios')


let access_token;

beforeAll(async () => {
    const imgUrl = "https://ik.imagekit.io/repathImageKit/james_Y2mFuV0noVO.jpg"
    const resp = {data : {url :imgUrl}};
    await axios.post.mockImplementation(() => Promise.resolve(resp))

    await userModel.deleteOne({ email: "imagekittest@mail.com" });
    const userPayload = {
        firstName: "imagekittest",
        lastName: "imagekittest",
        email: "imagekittest@mail.com",
        password: "12345",
        username: "imagekittest",
        city: "imagekittest",
        phoneNumber :"1234455"
      }
      
      user = await userModel.create(userPayload)
      const payloadJwt = { email: user.email }
      access_token = jwt.sign(payloadJwt, secretKey)

      await postModel.deleteOne({   text: "image kit test" })

   
  })
describe("POST/posts Add Post With Image Kit ", () => {

      test("success posting with image", (done) => {
        request(app)
        .post("/posts")
        .set('access_token', access_token)
        .field("type", "text")
        .field("text", "image kit test")
        .attach("imgUrl", "test/code.jpg")
        .then((response) => {
            const { body, status } = response;
            expect(status).toBe(201)
            expect(body).toHaveProperty("text", 'image kit test')
            expect(body).toHaveProperty("imgUrl", 'https://ik.imagekit.io/repathImageKit/james_Y2mFuV0noVO.jpg')

            done();
          })
          .catch((err) => {
            done(err);
          })
    })

    test("failed posting big size image", (done) => {
        request(app)
        .post("/posts")
        .set('access_token', access_token)
        .field("type", "text")
        .field("text", "image kit test")
        .attach("imgUrl", "test/childe.jpg")
        .then((response) => {
            const { body, status } = response;
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", 'Maximum file size is 300kb')
            done();
          })
          .catch((err) => {
            done(err);
          })
    })

    test("failed posting not image", (done) => {
        request(app)
        .post("/posts")
        .set('access_token', access_token)
        .field("type", "text")
        .field("text", "image kit test")
        .attach("imgUrl", "test/repath.pdf")
        .then((response) => {
            const { body, status } = response;
            expect(status).toBe(400)
            expect(body).toHaveProperty("message", 'Invalid file type')
            done();
          })
          .catch((err) => {
            done(err);
          })
    })
})

afterAll(async()=>{
    await  mongoose.disconnect()
})