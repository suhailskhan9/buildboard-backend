import express from 'express';
import validate from '../middleware/validate.js';
import { createTaskController } from '../controllers/taskController.js';
import { createTaskSchema } from '../schemas/taskSchemas.js';
import { projectIdSchema } from '../schemas/projectSchemas.js';


const tasksRouter = express.Router();

tasksRouter.post('/:projectId/tasks', validate(projectIdSchema, "params"), validate(createTaskSchema), createTaskController)

export default tasksRouter;