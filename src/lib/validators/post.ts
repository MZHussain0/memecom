import { z } from "zod";

export const postValidator = z.object({
  title: z
    .string()
    .min(3, { message: "title must be at least 3 characters" })
    .max(128, { message: "title must be less than 128 characters" }),
  content: z.any(),
  subredditId: z.string(),
});

export type postCreationRequest = z.infer<typeof postValidator>;
