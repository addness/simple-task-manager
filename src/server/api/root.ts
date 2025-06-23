import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { taskRouter } from "~/server/api/routers/task";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
