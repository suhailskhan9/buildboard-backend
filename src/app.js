import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BuildBoard API"
    })
})

app.get("/health", (req, res) => {
    res.json({
        status: "healthy"
    })
})

app.get("/projects", (req, res) => {
    res.json({
        message: "This is the projects endpoint"
    })
})

app.get("/tasks", (req, res) => {
    res.json({
        message: "This is the tasks endpoint"
    })
})