import { z } from "zod";

// Create task validation schema
export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().optional().nullable(),
    status: z.enum(['todo', 'in-progress', 'done']).optional().default('todo'),
    priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
    assignedTo: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null)
});

// Update task validation schema
export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
    description: z.string().optional().nullable(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    assignedTo: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable().transform((val) => val ? new Date(val) : null)
});

// Update task status validation schema
export const updateTaskStatusSchema = z.object({
    status: z.enum(['todo', 'in-progress', 'done'])
});

// Update task priority validation schema
export const updateTaskPrioritySchema = z.object({
    priority: z.enum(['low', 'medium', 'high'])
});

// Assign task validation schema
export const assignTaskSchema = z.object({
    assignedTo: z.string().nullable()
});

// Task ID validation
export const taskIdSchema = z.string().min(1, "Task ID is required");

// Workspace ID validation (for consistency)
export const workspaceIdSchema = z.string().min(1, "Workspace ID is required");

// Project ID validation (for consistency)
export const projectIdSchema = z.string().min(1, "Project ID is required");
