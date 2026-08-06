import * as projectService from "../services/projectService.js";

export async function getAllProjectsController(req, res) {
    const ownerId = req.user.id;
    const projects = await projectService.getAllProjects(ownerId);
    return res.status(200).json(projects);

}


export async function getProjectByIdController(req, res) {
    const { id } = req.params;
    const ownerId = req.user.id;

    const project = await projectService.getProjectById({ id, ownerId });
    return res.status(200).json(project)
}

export async function createProjectController(req, res) {
    const { name, description } = req.body;
        
    const ownerId = req.user.id;

    const project = await projectService.createProject({ name, description, ownerId })

    return res.status(201).json(project);
}


export async function updateProjectController(req, res) {
    const { id } = req.params;
    const { name } = req.body;
    const ownerId = req.user.id;

    const project = await projectService.updateProject({ id, name, ownerId });

    return res.status(200).json(project);
}

export async function deleteProjectController(req, res) {
    const { id } = req.params
    const ownerId = req.user.id;
        
    const project = await projectService.deleteProject({ id, ownerId })

    return res.status(200).json({message: "Project deleted successfully", project: project});

}