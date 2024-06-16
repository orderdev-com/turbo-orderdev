import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect, url, locals }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    if (!email) {
        return new Response("Email is required", { status: 400 });
    }

    const { error } = await locals.supabase.auth.signInWithOtp({
        email,
        options: {
            // set this to false if you do not want the user to be automatically signed up
            shouldCreateUser: true,
        },
    });

    if (error) {
        return new Response(error.message, { status: 500 });
    }

    cookies.set("otp-email", email, {
        path: "/",
    });

    return redirect("/ask-otp");
};