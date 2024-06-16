// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const user = defineMiddleware(async (context, next) => {
    context.locals.user = (await context.locals.supabase.auth.getUser()).data.user;
    return next();
});