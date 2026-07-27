import express from "express";

import authMiddleware from "./middleware/authMiddleware.js";
import authRouter from "./routes/authRoutes.js";
import projectsRouter from "./routes/projectsRoutes.js";

const app = express();
app.use(express.json())

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


app.use(authRouter);

app.use('/projects', projectsRouter);




export default app;