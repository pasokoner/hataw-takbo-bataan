import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { participantRouter } from "./routers/participantBataan";
import { eventRouter } from "./routers/event";
import { kilometerRouter } from "./routers/kilometer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  example: exampleRouter,
  km: kilometerRouter,
  participant: participantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
