const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const jwt = require("jsonwebtoken");
const User = require("../controller/userController");

let access_token_one
let access_token_two
let access_token_three
let user_one
let user_two
let user_three

beforeAll(async () => {
    await userModel.deleteOne({   email: "testuser@mail.com" })
    await userModel.deleteOne({   email: "testuser2@mail.com" })
    await userModel.deleteOne({   email: "testuser3@mail.com" })
    await userModel.deleteOne({   email: "testuser4@mail.com" })


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

afterAll(async()=> {
   await  mongoose.disconnect()
})

describe("GET /users", () => {
    // it('Should handle error 500', async () => {
    //     jest.spyOn(User, 'findUsers').mockRejectedValue('Error')
    
    //     return request(app)
    //       .get('/users')
    //       .then((res) => {
    //         expect(res.status).toBe(500)
    
    //         expect(res.body.err).toBe('Error')
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })

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
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Access token not found')
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("with query", (done) => {
        request(app)
        .get("/users?name=wow")
        .set('access_token',access_token_one)
          .then((resp) => {
            const result = resp.body;

            expect(resp.status).toBe(200);
            expect(result).toEqual(expect.any(Array));

            done();
          })
          .catch((err) => {
            done(err);
          })
    })

    test("get user by id success", (done) => {
        request(app)
        .get(`/users/${user_one._id}`)
        .set("access_token", access_token_one)
        .then((resp) => {
            const result = resp.body;

            expect(resp.status).toBe(200);
            expect(result).toEqual(expect.any(Object));

            done();
          })
          .catch((err) => {
            done(err);
          })
    })
})

describe("POST /register", () => {
    // test('Should handle error 500', async () => {
    //     jest.spyOn(User, 'addUser').mockRejectedValue('Error')
    
    //     return request(app)
    //       .post('/users/register')
    //       .then((res) => {
    //         expect(res.status).toBe(500)
    
    //         expect(res.body.err).toBe('Error')
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })
    
    test("success register", (done) => {
        request(app)
         .post('/users/register')
        .send({
            firstName: "test",
            lastName: "test",
            email: "testuser@mail.com",
            password: "12345",
            username: "testuser",
            city: "test",
            phoneNumber :"1234455"
        })
        .then((resp)=>{
         const result = resp.body
            expect(resp.status).toBe(201)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('_id')
            expect(result).toHaveProperty('email',"testuser@mail.com")
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
            email: "testuser@mail.com",
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
            username: "testuser",
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

describe("POST /login", () => {
    // test('Should handle error 500', async () => {
    //     jest.spyOn(User, 'login').mockRejectedValue('Error')
    
    //     return request(app)
    //       .post('/users/login')
    //       .then((res) => {
    //         expect(res.status).toBe(500)
    
    //         expect(res.body.err).toBe('Error')
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })
    
    test("success login", (done) => {
        request(app)
         .post('/users/login')
        .send({
            email: "testuser@mail.com",
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
            email: "testuser@mail.com",
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
            email: "testuser@mail.com",
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

    test("failed invalid email", (done) => {
        request(app)
        .post("/users/login")
        .send({
            email: "testuser100@mail.com",
            password: "12345"
        })
          .then((resp) => {
            const result = resp.body
            expect(resp.status).toBe(401)
            expect(result).toEqual(expect.any(Object))
            expect(result).toHaveProperty('message', 'Invalid email/password')

              done();
          })
          .catch((err) => {
              done(err);
          })
    })
})

describe("PUT /users", () => {
    // test('Should handle error 500', async () => {
    //     jest.spyOn(User, 'editUser').mockRejectedValue('Error')
    
    //     return request(app)
    //       .put('/users/mockId')
    //       .then((res) => {
    //         expect(res.status).toBe(500)
    
    //         expect(res.body.err).toBe('Error')
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })

    test.only("success update own account", (done) => {
        const user_two_id = user_two._id.toString()
        request(app)
        .put(`/users/${user_two_id}`)
        .send({
            firstName: "testone",
            lastName: "testone",
            username: "testoneaas",
            city: "testone",
            phoneNumber :"1234455"
        })
        .set('access_token',access_token_two)
        .then((resp)=>{
            console.log(resp.body, `<<<<<<<<<<<<<<<<<<`)
            const result = resp.body
            expect(resp.status).toBe(200)
            expect(result).toEqual(expect.any(Object))
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed update own account", (done) => {
        const user_two_id = user_two._id.toString()
        
        request(app)
        .put(`/users/${user_two_id}`)
        .send({
            firstName: "testone",
            lastName: "testone",
            username: "testoneaas",
            city: "testone",
            // phoneNumber :"1234455"
        })
        .set('access_token',access_token_two)
        .then((resp)=> {
            // console.log(resp, "==============", resp.body);
            const result = resp.body;
            expect(resp.status).toBe(400);
            expect(result).toEqual(expect.any(Object));
            expect(result).toHaveProperty("message", "Please input required fields on edit form");
    
            done()
        })
        .catch((err)=>{
            done(err)
        })
    })

    test("failed update other user's account", (done) => {
        const user_two_id = user_two._id.toString()
        
        request(app)
        .put(`/users/${user_two_id}`)
        .send({
            firstName: "testone",
            lastName: "testone",
            username: "testoneaas",
            city: "testone",
            phoneNumber :"1234455"
        })
        .set('access_token',access_token_one)
        .then((resp)=> {
            const result = resp.body;
            expect(resp.status).toBe(403);
            expect(result).toEqual(expect.any(Object));
            expect(result).toHaveProperty("message", "Forbidden access");
    
            done();
        })
        .catch((err)=>{
            done(err)
        })
    })
})

describe("DELETE /users", () => {
    // test('Should handle error 500', async () => {
    //     jest.spyOn(User, 'deleteUser').mockRejectedValue('Error')
    
    //     return request(app)
    //       .delete('/users/mockId')
    //       .then((res) => {
    //         expect(res.status).toBe(500)
    
    //         expect(res.body.err).toBe('Error')
    //       })
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   })
        test("success delete own account", (done) => {
            const user_one_id = user_one._id.toString()
            request(app)
            .delete(`/users/${user_one_id}`)
            .set('access_token',access_token_one)
            .then((resp)=>{
                const result = resp.body
                expect(resp.status).toBe(200)
                expect(result).toEqual(expect.any(String))
               
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
                expect(result).toHaveProperty('message', "Forbidden access")
            
                done()
            })
            .catch((err)=>{
                done(err)
            })
        })
})
