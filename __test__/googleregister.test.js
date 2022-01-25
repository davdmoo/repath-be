jest.mock("google-auth-library");
const { OAuth2Client } = require('google-auth-library');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('../config/monggoConfig');
const userModel = require('../models/userModel');

const verifyIdTokenMock = jest.fn(()=>{
    return {
        getPayload(){
            return {
                iss: 'accounts.google.com',
                azp: '306277501455-3tep6b17k5avj734itbeqju5g6asoind.apps.googleusercontent.com',
                aud: '306277501455-3tep6b17k5avj734itbeqju5g6asoind.apps.googleusercontent.com',
                sub: '107986439092092736861',
                email: 'herokuagnes@gmail.com',
                email_verified: true,
                at_hash: 'tP1FRvZMnHOvt5ECianluw',
                name: 'heroku agnes',
                picture: 'https://lh3.googleusercontent.com/a/AATXAJyaXlYsRZOMEvK2Wil_W6HtjZE4_W_4wgikSj4L=s96-c',
                given_name: 'heroku',
                family_name: 'agnes',
                locale: 'id',
                iat: 1643108670,
                exp: 1643112270,
                jti: 'b58730a1192e6e69e8ad9bb846cae2971a5ff6b6'
              }
        }
    }
});

beforeAll(async () => {
    await userModel.deleteOne({   email: 'herokuagnes@gmail.com' })
})

OAuth2Client.mockImplementation(() => {
  return {
    verifyIdToken : verifyIdTokenMock,
  }
});

describe('google login', () => {
    test("success get all user", (done) => {
        request(app)
        .post('/users/googleLogin')
        .send({idToken: 'test-google'})
        .then((resp)=>{
           const {status,body} = resp
           expect(status).toBe(201)
           expect(body).toEqual(expect.any(Object));
           expect(body).toHaveProperty("email",'herokuagnes@gmail.com')
           expect(body).toHaveProperty("firstName",'heroku')
           done()
        })
        .catch((err)=>{
            done(err)
        })
    })
})

afterAll(async()=>{
    await  mongoose.disconnect()
})