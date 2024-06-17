// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const handleLastReferer = defineMiddleware(async (context, next) => {
    const lastReferer = context.cookies.get("last-referer")?.value;
    if (lastReferer && context.locals.user) {
        const { data, error } = await context.locals.supabase.auth.getSession();
        if (data && data.session && !error) {
            const redirectUrl = new URL(lastReferer);
            redirectUrl.searchParams.append("access_token", data.session.access_token);
            redirectUrl.searchParams.append("refresh_token", data.session.refresh_token);
            context.cookies.delete("last-referer", { path: "/" });
            return context.redirect(redirectUrl.toString());
        }
    }
    return next();
});