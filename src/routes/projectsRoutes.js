import express from 'express';
import pool from '../config/database.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { projectIdSchema, createProjectSchema, updateProjectSchema } from '../schemas/projectSchemas.js';
import logger from '../config/logger.js';

const projectsRouter = express.Router()

projectsRouter.use(authMiddleware);

projectsRouter.get("/", async (req, res) => {
        const ownerId = req.user.id;
        const result = await pool.query("SELECT * FROM projects WHERE owner_id = $1", [ownerId]);
        // pool.query returns rows, rowCount, command, fields ....
        const projects = result.rows;
        return res.status(200).json(projects);
});

projectsRouter.get("/:id", validate(projectIdSchema, "params"), async (req, res) => {
        const { id } = req.params;
        const ownerId = req.user.id;

        const result = await pool.query("SELECT * from projects WHERE id = $1 AND owner_id = $2", [id, ownerId])
        const project = result.rows[0];
        if(!project){
            return res.status(404).json({
                message: "Project Not Found"
            }) 
        }
        return res.status(200).json(project)
})

projectsRouter.post("/", validate(createProjectSchema), async (req, res) => {
        const { name, description } = req.body;
        
        const ownerId = req.user.id;

        const result = await pool.query("INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *", [name, description, ownerId])
        
        const project = result.rows[0];

        logger.info(
            {
                userId: ownerId,
                projectId: project.id
            },
            "Project created"
        )

        return res.status(201).json(project);
})

projectsRouter.patch("/:id", validate(projectIdSchema, "params"), validate(updateProjectSchema), async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const ownerId = req.user.id;

        const result = await pool.query("UPDATE projects SET name = $1 WHERE id = $2 AND owner_id = $3 RETURNING *", [name, id, ownerId]);
        const project = result.rows[0];

        if(!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        logger.info(
            {
                userId: ownerId,
                projectId: project.id
            },
            "Project updated"
        )

        return res.status(200).json(project);
})

projectsRouter.delete("/:id", validate(projectIdSchema, "params"), async (req, res) => {
        const { id } = req.params
        const ownerId = req.user.id;
        
        const result = await pool.query("DELETE FROM projects WHERE id = $1 AND owner_id = $2 RETURNING *", [id, ownerId]);
        const project = result.rows[0];

        if(!project) {
            return res.status(404).json({
                message: "Project Not Found"
            })
        }

        logger.info(
            {
                userId: ownerId,
                projectId: project.id
            },
            "Project deleted"
        )

        return res.status(200).json({message: "Project deleted successfully", project: project});
})

export default projectsRouter;