const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const jwt = require("jsonwebtoken");
const mongoose = require('../config/monggoConfig');
const secretKey = process.env.SECRETKEY;
const axios = require('axios')
jest.mock('axios')
const Post = require("../controller/postController");

let access_token;
let dummyAccToken;
let post;
let dummyPost;
let user;
let dummyUser;

beforeAll(async () => {
    await userModel.deleteOne({ email: "test3@mail.com" });
    await postModel.deleteOne({ text: "test1" });
    await userModel.deleteOne({ email: "test113@mail.com" });
    await postModel.deleteOne({ text: "post to delete" });

    
    const dummyUserPayload = {
      firstName: "test 11",
      lastName: "test 11",
      email: "test113@mail.com",
      password: "12345",
      username: "test311",
      city: "test11",
      phoneNumber :"1234455"
    }
    dummyUser = await userModel.create(dummyUserPayload);
    const dummyPayload = { email: dummyUser.email };
    dummyAccToken = jwt.sign(dummyPayload, secretKey);
    
    const userPayload = {
      firstName: "test",
      lastName: "test",
      email: "test3@mail.com",
      password: "12345",
      username: "test3",
      city: "test",
      phoneNumber :"1234455"
    }
    user = await userModel.create(userPayload)
    const payloadJwt = { email: user.email };
    access_token = jwt.sign(payloadJwt, secretKey);
    
    await postModel.deleteOne().or([{ text: "text 1" }, { text: "text 2" }]);
    let payload = {
      type : "text",
      userId: user._id,
      text: "text 1"
    } 
    
    dummyPost = await postModel.create({ type: "text", text: "post to delete", userId: user._id });
    post = await postModel.create(payload);
});

beforeEach(() => {
  jest.restoreAllMocks()
});

describe("GET /posts", () => {
    it('Should handle error when hit findAll', async () => {
      jest.spyOn(Post, 'findPosts').mockRejectedValue('Error')
  
      return request(app)
        .get('/posts')
        .then((res) => {
          expect(res.status).toBe(500)
  
          expect(res.body.err).toBe('Error')
        })
        .catch((err) => {
          console.log(err)
        })
    })

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

describe("POST /posts", () => {
  it('Should handle error 500', async () => {
    jest.spyOn(Post, 'addPost').mockRejectedValue('Error')

    return request(app)
      .post('/posts')
      .then((res) => {
        expect(res.status).toBe(500)

        expect(res.body.err).toBe('Error')
      })
      .catch((err) => {
        console.log(err)
      })
  })
    describe("user input is correct", () => {
      const imgUrl = "https://ik.imagekit.io/repathImageKit/james_Y2mFuV0noVO.jpg"
      const resp = {data : {url :imgUrl}};
      const test =  axios.post.mockImplementation(() => Promise.resolve(resp))
      console.log(test.mockReturnValueOnce,`AAAAAAAAAAAAAAAAAA`)
        test("success posting", (done) => {
            request(app)
            .post("/posts")
            .set('access_token', access_token)
            .send({
              type: "text",
              text: "test post",
              // imgUrl :  axios.get.mockResolvedValue(resp)
            })
              .then((response) => {
                const result = response.body;
                console.log(result, `TESTT`)
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

describe("PUT /posts", () => {
  it('Should handle error 500', async () => {
    jest.spyOn(Post, 'editPost').mockRejectedValue('Error')

    return request(app)
      .put('/posts/mockId')
      .then((res) => {
        expect(res.status).toBe(500)

        expect(res.body.err).toBe('Error')
      })
      .catch((err) => {
        console.log(err)
      })
  })

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
        test("no access token", (done) => {
          const postId = post._id;
          request(app)
          .put(`/posts/${postId}`)
          .send({
            text: "text 2"
          })
            .then((response) => {
              const { body, status } = response;
              expect(status).toBe(401);
              expect(body).toEqual(expect.any(Object));
              expect(body).toHaveProperty("message", "Access token not found");

              done();
            })
            .catch((err) => {
              done(err);
            });
        });

        test("post not found", (done) => {
          const postId = "61ebac652645ef3ccfbc680g";
          request(app)
          .put(`/posts/${postId}`)
          .set("access_token", access_token)
          .send({
            text: "text 2"
          })
            .then((response) => {
              const { body, status } = response;
              expect(status).toBe(404);
              expect(body).toEqual(expect.any(Object));
              expect(body).toHaveProperty("message", "Content not found");

              done();
            })
            .catch((err) => {
              done(err);
            });
        })

        test("forbidden access", (done) => {
          request(app)
          .put(`/posts/${post._id}`)
          .set("access_token", dummyAccToken)
          .send({
            text: "text 2"
          })
            .then((response) => {
              const { body, status } = response;
              expect(status).toBe(403);
              expect(body).toEqual(expect.any(Object));
              expect(body).toHaveProperty("message", "Forbidden access");

              done();
            })
            .catch((err) => {
              done(err);
            });
        })
    })
})

describe("DELETE /posts", () => {
  it('Should handle error 500', async () => {
    jest.spyOn(Post, 'deletePost').mockRejectedValue('Error')

    return request(app)
      .post('/posts/mockId')
      .then((res) => {
        expect(res.status).toBe(500)

        expect(res.body.err).toBe('Error')
      })
      .catch((err) => {
        console.log(err)
      })
  })
    describe("delete failed", () => {
      test("forbidden access", (done) => {
        request(app)
        .delete(`/posts/${post._id}`)
        .set("access_token", dummyAccToken)
          .then((response) => {
            const { body, status } = response;
            expect(status).toBe(403);
            expect(body).toEqual(expect.any(Object));
            expect(body).toHaveProperty("message", "Forbidden access");

            done();
          })
          .catch((err) => {
            done(err);
          })
      })

      test("post not found", (done) => {
        const postId = "61ebac652645ef3ccfbc680g";
        request(app)
        .delete(`/posts/${postId}`)
        .set("access_token", access_token)
          .then((response) => {
            const { body, status } = response;
            expect(status).toBe(404);
            expect(body).toEqual(expect.any(Object));
            expect(body).toHaveProperty("message", "Content not found");

            done();
          })
          .catch((err) => {
            done(err);
          })
      })
    })

    describe("delete success", () => {
      test("delete success", (done) => {
        request(app)
        .delete(`/posts/${post._id}`)
        .set("access_token", access_token)
          .then((response) => {
            const { body, status } = response;
            expect(status).toBe(200);
            expect(body).toEqual(expect.any(Object));
            
            done();
          })
          .catch((err) => {
            done(err);
          })
      })
    })
})

afterAll(async()=>{
      await  mongoose.disconnect()
})
