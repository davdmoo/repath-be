const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('mongoose');

describe("GET /likes", () => {
    describe("when user have access token", () => {

    })

    describe("when user dont have access token", () => {

    })
})

describe("POST /likes", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })
})

describe("PUT /likes", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })
})

describe("DELETE /likes", () =>{
    describe("user wanted to delete own post", () => {

    })

    describe("user wanted to delete other post", () => {

    })
})