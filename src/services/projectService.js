import { withTransaction } from '../config/database.js';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';
import * as projectRepository from '../repositories/projectRepository.js';
import * as projectMemberRepository from '../repositories/projectMemberRepository.js';

export async function getAllProjects(userId) {
    const projects = await projectRepository.getAllProjects(userId);
    return projects;
}

export async function getProjectById({ id, userId }) {
        const project = await projectRepository.getProjectById({ id, userId });
        if(!project){
            throw new AppError(404, "Project not found");
        }

        return project;
}

export async function createProject({name, description, userId}) {
        const project = await withTransaction(async (client) => {
            
            const project = await projectRepository.createProject(client, {name, description});

            await projectMemberRepository.create(
                client,
                {
                    projectId: project.id,
                    userId,
                    role: "owner"
                }
            )

            return project;
        })
        
        logger.info(
            {
                userId,
                projectId: project.id
            },
            "Project created"
        )

        return project;
}

export async function updateProject({ id, name, userId }) {
    const project = await projectRepository.updateProject({ id, name, userId });
    if(!project) {
        throw new AppError(404, "Project not found")
    }

    logger.info(
        {
            userId: userId,
            projectId: project.id
        },
        "Project updated"
    )
    return project;
}

export async function deleteProject({id, userId}) {
    const project = await projectRepository.deleteProject({ id, userId });

    if(!project) {
        throw new AppError(404, "Project not found");
    }

    logger.info(
        {
            userId: userId,
            projectId: project.id
        },
        "Project deleted"
    )

    return project;
}