// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { accountRouter } from "./account";
import { petsRouter } from "./pets";
import { jobsRouter } from "./jobs";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("account.", accountRouter)
  .merge("jobs.", jobsRouter)
  .merge("pets.", petsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
