// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
// import { supabase } from "../lib/supabase";

export const user = defineMiddleware(async (context, next) => {
    // const accessToken = context.cookies.get("sb-access-token");
    // const refreshToken = context.cookies.get("sb-refresh-token");

    // if (!accessToken || !refreshToken) {
    //     context.locals.user = null;
    //     // if (context.url.pathname.startsWith("/dashboard")) {
    //     //     return context.redirect("/signin");
    //     // }
    //     return next();
    // }

    // const { data, error } = await supabase.auth.setSession({
    //     refresh_token: refreshToken.value,
    //     access_token: accessToken.value,
    // });

    // if (error) {
    //     console.error("Error setting session:", error.message);
    //     context.cookies.delete("sb-access-token", {
    //         path: "/",
    //     });
    //     context.cookies.delete("sb-refresh-token", {
    //         path: "/",
    //     });
    //     context.locals.user = null;
    //     // if (context.url.pathname.startsWith("/dashboard")) {
    //     //     return context.redirect("/signin");
    //     // }
    //     return next();
    // }

    // context.locals.user = data.user;
    context.locals.user = (await context.locals.supabase.auth.getUser()).data.user;
    // if (!context.locals.user) {
    //     if (context.url.pathname.startsWith("/dashboard")) {
    //         return context.redirect("/signin");
    //     }
    // }
    return next();
});