import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ cookies, redirect, locals }) => {
    // const { error } = await locals.supabase.auth.signOut({
    //     scope: "global" //"global" | "local" | "others"
    // })
    const { error } = await locals.supabase.auth.signOut(); // default: "global" 
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return redirect("/");
};