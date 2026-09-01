import * as taskService from '../services/taskService.js'

export async function createTaskController(req, res) {
    const { projectId } = req.params;
    const userId = req.user.id;
    const taskData = req.body;
    
    const task = await taskService.createTask({ projectId, userId, taskData });

    return res.status(201).json(task);
};