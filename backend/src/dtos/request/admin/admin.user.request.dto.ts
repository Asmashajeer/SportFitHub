import { z } from 'zod';

export const getAllusersSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .max(100) // Protects your DB from "limit=99999"
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(5),
  search: z.string().default(''),
  status: z.string().default('all'),
  role: z.string().default('all'),
});
export type getAllUsersRequestDTO = z.infer<typeof getAllusersSchema>;
