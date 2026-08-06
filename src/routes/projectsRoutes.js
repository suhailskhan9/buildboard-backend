import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { projectIdSchema, createProjectSchema, updateProjectSchema } from '../schemas/projectSchemas.js';
import { createProjectController, deleteProjectController, getAllProjectsController, getProjectByIdController, updateProjectController } from '../controllers/projectController.js';

const projectsRouter = express.Router()

projectsRouter.use(authMiddleware);

projectsRouter.get("/", getAllProjectsController);

projectsRouter.get("/:id", getProjectByIdController);

projectsRouter.post("/", validate(createProjectSchema), createProjectController);

projectsRouter.patch("/:id", validate(projectIdSchema, "params"), validate(updateProjectSchema), updateProjectController);

projectsRouter.delete("/:id", validate(projectIdSchema, "params"), deleteProjectController);

export default projectsRouter;