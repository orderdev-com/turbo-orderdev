import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { defineMiddleware } from "astro:middleware";

export const supabase = defineMiddleware(async (context, next) => {
    context.locals.supabase = createServerClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_ANON_KEY,
        {
            cookies: {
                get(key: string) {
                    return context.cookies.get(key)?.value;
                },
                set(key: string, value: string, options: CookieOptions) {
                    context.cookies.set(key, value, { ...options, path: '/' });
                },
                remove(key: string, options: any) {
                    context.cookies.delete(key, { ...options, path: '/' });
                },
            },
            auth: {
                flowType: "pkce",
            },
        }
    );

    const authCode = context.url.searchParams.get("code");

    if (authCode) {
        await context.locals.supabase.auth.exchangeCodeForSession(authCode);
        return context.redirect("/");
    }

    return next();
});