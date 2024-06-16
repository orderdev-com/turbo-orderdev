import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies, redirect, url, locals }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const otp = formData.get("otp")?.toString();
    if (!email || !otp) {
        return new Response("Email and one-time-password are required", { status: 400 });
    }
    const {
        error,
    } = await locals.supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
    });
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return redirect("/");
};