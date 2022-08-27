jest.mock("google-auth-library");
const { OAuth2Client } = require('google-auth-library');
const request = require('supertest');
const app = require('../index.js')
const mongoose = require('../config/monggoConfig');

const verifyIdTokenMock = jest.fn(()=>{
    return {
        getPayload(){
            return {
                iss: 'accounts.google.com',
                azp: '306277501455-3tep6b17k5avj734itbeqju5g6asoind.apps.googleusercontent.com',
                aud: '306277501455-3tep6b17k5avj734itbeqju5g6asoind.apps.googleusercontent.com',
                sub: '107623805628328758304',
                email: 'gamewebagsur@gmail.com',
                email_verified: true,
                at_hash: 'Ox4zT_5VoJKwfLYV7gmB_w',
                name: 'game web',
                picture: 'https://lh3.googleusercontent.com/a/AATXAJyqlf1-4f7KnIakfs_vqCoaMa4BQev8dHIRPTBO=s96-c',
                given_name: 'game',
                family_name: 'web',
                locale: 'id',
                iat: 1643107738,
                exp: 1643111338,
                jti: 'da9c862d813dd56d405b8d64f8fc1bfe7ad3aa8c'
              }
        }
    }
});

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
           expect(status).toBe(200)
           expect(body).toEqual(expect.any(Object));
           expect(body).toHaveProperty("access_token")
           expect(body).toHaveProperty("payloadUser")
           expect(body.payloadUser).toHaveProperty("email")

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