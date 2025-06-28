import { z } from 'zod';

export const UpdateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
