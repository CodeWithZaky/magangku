import { adminRouter } from "./routers/admin";
import { internRouter } from "./routers/intern";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  intern: internRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
