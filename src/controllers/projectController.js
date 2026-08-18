import * as projectService from "../services/projectService.js";

export async function getAllProjectsController(req, res) {
    const userId = req.user.id;
    const projects = await projectService.getAllProjects(userId);
    return res.status(200).json(projects);

}


export async function getProjectByIdController(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const project = await projectService.getProjectById({ id, userId });
    return res.status(200).json(project)
}

export async function createProjectController(req, res) {
    const { name, description } = req.body;
        
    const userId = req.user.id;

    const project = await projectService.createProject({ name, description, userId })

    return res.status(201).json(project);
}


export async function updateProjectController(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const project = await projectService.updateProject({ id, name, userId });

    return res.status(200).json(project);
}

export async function deleteProjectController(req, res) {
    const { id } = req.params
    const userId = req.user.id;
        
    const project = await projectService.deleteProject({ id, userId })

    return res.status(200).json({message: "Project deleted successfully", project: project});

}