import { z } from "zod";

export const createProfileSchema = z.object({
  profile_name: z.string(),
});

export type CreateProfileSchema = z.infer<typeof createProfileSchema>;
