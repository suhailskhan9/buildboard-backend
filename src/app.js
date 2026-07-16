import express from "express";
import pool from "./db/database";
import bcrypt from 'bcrypt';

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

app.post("/signup", async (req, res) => {
    try{
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        
        if(!email || !username || !password) {
            return res.status(400).json({
                message: "Missing required fields"
            })
        }
        
        const existingEmail = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if(existingEmail.rowCount !== 0) {
            return res.status(409).json({
                message: "Email already exists"
            })
        }
        
        const existingUsername = await pool.query("SELECT id FROM users WHERE username = $1", [username])
        if(existingUsername.rowCount !== 0) {
            return res.status(409).json({
                message: "Username already exists"
            })
        }
        
        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query("INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)", [email, username, passwordHash]);
        return res.status(201).json({
            message: "User created successfully"
        })
    }
    catch(err) {
        console.error("Signup failed: ", err)
        return res.status(500).json({
            message: "Error while creating account"
        })
    }
})

app.get("/projects", async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM projects");
        // pool.query returns rows, rowCount, command, fields ....
        const projects = result.rows;
        return res.status(200).json(projects);
    }
    catch(err){
        console.log("Error while retrieving projects", err)
        return res.status(500).json(
            {
                message: "Error while retrieving projects"
            }
        )
    }
});

app.get("/projects/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Project id needs to be a number"
            })
        }

        const result = await pool.query("SELECT * from projects WHERE id = $1", [id])
        const project = result.rows[0];
        if(!project){
            return res.status(404).json({
                message: "Project Not Found"
            }) 
        }
        return res.status(200).json(project)
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
           message: "Error while retrieving project"
        }) 
    }

})

app.post("/projects", async (req, res) => {
    try{
        const name = req.body.name;
        const description = req.body.description;
        const owner_id = Number(req.body.owner_id);
        if(!Number.isInteger(owner_id) || owner_id <= 0) {
            return res.status(400).json({
                message: "Invalid input, owner id should be number"
            })
        }
        if(typeof(name) !== 'string' || name.trim().length === 0){
            return res.status(400).json({
                message: "Invalid input, project name mandatory"
            })
        }
        const result = await pool.query("INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *", [name, description, owner_id])
        
        const project = result.rows[0];

        return res.status(201).json(project);
    }
    catch(err) {
        console.error("Error: ",err);
        return res.status(500).json({
            message: "Error while creating project"
        })
    }
})

app.patch("/projects/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        const name = req.body.name;
        
        if(!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Project id needs to be a number"
            })
        }

        if(typeof(name) !== 'string' || name.trim().length === 0){
            return res.status(400).json({
                message: "Invalid input, project name mandatory"
            })
        }

        const result = await pool.query("UPDATE projects SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
        const project = result.rows[0];

        if(!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }
        return res.status(200).json(project);
    }
    catch(err){
        console.error("Error: ",err)
        return res.status(500).json({
            message: "Error while updating project details"
        })
    }
})

app.delete("/projects/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
            
        if(!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Project id needs to be a number"
            })
        }

        const result = await pool.query("DELETE FROM projects WHERE id = $1 RETURNING *", [id]);
        const project = result.rows[0];

        if(!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        return res.status(200).json({message: "Project deleted successfully", project: project});
    }
    catch(err){
        console.error("Error: ", err);
        return res.status(500).json({
            message: "Error while deleting the project"
        })
    }
})



export default app;