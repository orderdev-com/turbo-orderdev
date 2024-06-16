import type { APIRoute } from "astro";
import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, redirect, url, locals }) => {
    const formData = await request.formData();
    const provider = formData.get("provider")?.toString();

    const validProviders = [
        "google",
        // "github",
        // "discord"
    ];

    if (provider && validProviders.includes(provider)) {
        const { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: provider as Provider,
            options: {
                redirectTo: `${url.origin}`
            },
        });

        if (error) {
            return new Response(error.message, { status: 500 });
        }

        return redirect(data.url);
    }

    return redirect("/");
};