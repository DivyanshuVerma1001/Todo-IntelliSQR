import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  completed: z.boolean().optional(),
});

export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;

