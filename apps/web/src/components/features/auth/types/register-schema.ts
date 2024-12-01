import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.string().email(),
  phone_number: z.string(),
  fullname: z.string().min(3),
  password: z.string().min(8),
  retry_password: z.string().min(8),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
