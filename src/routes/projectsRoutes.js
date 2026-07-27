import express from 'express';
import pool from '../db/database.js';
import authMiddleware from '../middleware/authMiddleware.js';

const projectsRouter = express.Router()

projectsRouter.use(authMiddleware);

projectsRouter.get("/", async (req, res) => {
    try{
        const ownerId = req.user.id;
        const result = await pool.query("SELECT * FROM projects WHERE owner_id = $1", [ownerId]);
        // pool.query returns rows, rowCount, command, fields ....
        const projects = result.rows;
        return res.status(200).json(projects);
    }
    catch(err){
        console.error("Error while retrieving projects", err)
        return res.status(500).json(
            {
                message: "Error while retrieving projects"
            }
        )
    }
});

projectsRouter.get("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        const ownerId = req.user.id;
        if(!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Project id needs to be a number"
            })
        }

        const result = await pool.query("SELECT * from projects WHERE id = $1 AND owner_id = $2", [id, ownerId])
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

projectsRouter.post("/", async (req, res) => {
    try{
        const { name, description } = req.body ?? {};
        
        const ownerId = req.user.id;

        if(typeof(name) !== 'string' || name.trim().length === 0){
            return res.status(400).json({
                message: "Invalid input, project name mandatory"
            })
        }
        const result = await pool.query("INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *", [name, description, ownerId])
        
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

projectsRouter.patch("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        const { name } = req.body ?? {};
        const ownerId = req.user.id;

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

        const result = await pool.query("UPDATE projects SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *", [name, id, ownerId]);
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

projectsRouter.delete("/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);
        const ownerId = req.user.id;
        
        if(!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Project id needs to be a number"
            })
        }

        const result = await pool.query("DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING *", [id, ownerId]);
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

export default projectsRouter;