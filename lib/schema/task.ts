import {z} from "zod";

export const createTaskSchema=z.object({
    title:z.string().min(1,'title is required').max(100,'toolong'),
    description:z.string().max(500,'').optional().default(''),
});
export type TaskInput=z.infer <typeof createTaskSchema>;