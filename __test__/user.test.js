import supertest from "supertest";
import app from "../app";
import userModel from "../models/userModel";

beforeAll(async () => {
    const mongoDB = "http://localhost:127017/test";
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log("connected")
        }
    })
});

describe("GET /users", () => {
    describe("when user have access token", () => {

    })

    describe("when user dont have access token", () => {

    })
})

describe("POST /register", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })
})

describe("POST /login", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })

    describe("user is not registered", () => {

    })
})

describe("DELETE /users", () =>{
    describe("user wanted to delete own account", () => {

    })

    describe("user wanted to delete other account", () => {

    })
})