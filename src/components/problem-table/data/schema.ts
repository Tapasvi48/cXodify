import { z } from "zod";
import { difficulty } from "./data";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  difficulty: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
