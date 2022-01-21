const app = require('../app.js');
const request = require('supertest');
const mongoose = require('mongoose');
const postModel = require('../models/postModel');
const commentModel = require('../models/commentModel');

describe("GET /comments", () => {
    describe("when user have access token", () => {
        test("user cannot access comment section", async () => {
            const response = await request(app).get("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(403)
        })
    })

    describe("when user dont have access token", () => {
        test("user can access and see comment section", async () => {
            const response = await request(app).get("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("POST /comments", () => {
    describe("user input is correct", () => {
        test("user success to make a comment", async () => {
            const response = await request(app).post("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(201)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to make a comment", async () => {
            const response = await request(app).post("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("PUT /comments", () => {
    describe("user input is correct", () => {
        test("user success to edit a comment", async () => {
            const response = await request(app).put("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user input is incorrect", () => {
        test("user failed to edit a comment", async () => {
            const response = await request(app).put("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("DELETE /comments", () => {
    describe("user wanted to delete own comment", () => {
        test("user success to delete a comment", async () => {
            const response = await request(app).delete("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })

    describe("user wanted to delete other comment", () => {
        test("user success to delete a comment", async () => {
            const response = await request(app).delete("/comments")
            .send({
                access_token: null
            })
            expect(response.statusCode).toBe(200)
        })
    })
})