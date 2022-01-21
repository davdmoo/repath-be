const userModel = require('../models/userModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('mongoose');

beforeAll(async () => {
});

describe("GET /users", () => {
    describe("when user have access token", () => {
       test("as", ()=>{
           
       })
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