import { z } from "zod";

export const projectIdSchema = z.object({
    id: z.coerce.number().int().positive()
})