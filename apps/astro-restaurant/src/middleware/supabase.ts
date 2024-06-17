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

    // it was only needed for email auth, I think we do not need this for restaurants app.
    // TODO:
    // const authCode = context.url.searchParams.get("code");
    // if (authCode) {
    //     await context.locals.supabase.auth.exchangeCodeForSession(authCode);
    //     return context.redirect("/");
    // }

    // if we have access_token and refresh_token in the query params, we set the session
    const accessToken = context.url.searchParams.get("access_token");
    const refresh_token = context.url.searchParams.get("refresh_token");
    if (accessToken && refresh_token) {
        await context.locals.supabase.auth.setSession({
            access_token: accessToken,
            refresh_token
        });
        // remove access_token and refresh_token from the query params
        context.url.searchParams.delete("access_token");
        context.url.searchParams.delete("refresh_token");
        return context.redirect(context.url.toString());
    }

    return next();
});