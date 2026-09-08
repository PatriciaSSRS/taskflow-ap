const { z } = require('zod');

const STATUS = ['a_fazer', 'em_andamento', 'concluida'];
const PRIORITY = ['baixa', 'media', 'alta'];

const registerSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    email: z.string().trim().email().max(160).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(STATUS).optional(),
  priority: z.enum(PRIORITY).optional(),
});

const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    status: z.enum(STATUS).optional(),
    priority: z.enum(PRIORITY).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

const taskFilterSchema = z.object({
  status: z.enum(STATUS).optional(),
  priority: z.enum(PRIORITY).optional(),
});

module.exports = {
  STATUS,
  PRIORITY,
  registerSchema,
  loginSchema,
  updateUserSchema,
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
};
