import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().trim().min(3).max(50),
    description: z.string().trim().max(1000).optional(),
    assigned_to_id: z.coerce.number().int().positive().optional(),
    status: z.enum(["todo", "in_progress", "done"]).default("todo"),
    due_date: z.iso.date().optional()
})