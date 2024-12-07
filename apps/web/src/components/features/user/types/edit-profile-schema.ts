import { z } from "zod";

export const editProfileSchema = z.object({
  profile_name: z.string(),
});

export type EditProfileSchema = z.infer<typeof editProfileSchema>;
