const postModel = require('../models/postModel');
const request = require('supertest');
const app = require('../app.js')
const mongoose = require('mongoose');

describe("GET /comments", () => {
    describe("when user have access token", () => {

    })

    describe("when user dont have access token", () => {

    })
})

describe("POST /comments", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })
})

describe("PUT /comments", () =>{
    describe("user input is correct", () => {

    })

    describe("user input is incorrect", () => {

    })
})

describe("DELETE /comments", () =>{
    describe("user wanted to delete own comment", () => {

    })

    describe("user wanted to delete other comment", () => {

    })
})