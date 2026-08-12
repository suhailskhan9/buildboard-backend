import { withTransaction } from '../config/database.js';
import logger from '../config/logger.js';
import AppError from '../errors/AppError.js';
import * as projectRepository from '../repositories/projectRepository.js';
import * as projectMemberRepository from '../repositories/projectMemberRepository.js';

export async function getAllProjects(ownerId) {
    const projects = await projectRepository.getAllProjects(ownerId);
    return projects;
}

export async function getProjectById({ id, ownerId }) {
        const project = await projectRepository.getProjectById({ id, ownerId });
        if(!project){
            throw new AppError(404, "Project not found");
        }

        return project;
}

export async function createProject({name, description, ownerId}) {
        const project = await withTransaction(async (client) => {
            
            const project = await projectRepository.createProject(client, {name, description, ownerId});

            await projectMemberRepository.create(
                client,
                {
                    projectId: project.id,
                    userId: ownerId,
                    role: "owner"
                }
            )

            return project;
        })
        
        logger.info(
            {
                userId: ownerId,
                projectId: project.id
            },
            "Project created"
        )

        return project;
}

export async function updateProject({ id, name, ownerId }) {
    const project = await projectRepository.updateProject({ id, name, ownerId });
    if(!project) {
        throw new AppError(404, "Project not found")
    }

    logger.info(
        {
            userId: ownerId,
            projectId: project.id
        },
        "Project updated"
    )
    return project;
}

export async function deleteProject({id, ownerId}) {
    const project = await projectRepository.deleteProject({ id, ownerId });

    if(!project) {
        throw new AppError(404, "Project not found");
    }

    logger.info(
        {
            userId: ownerId,
            projectId: project.id
        },
        "Project deleted"
    )

    return project;
}