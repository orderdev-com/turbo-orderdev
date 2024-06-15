import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    console.log("email");
    console.log(email);

    if (!email || !password) {
        return new Response("Email and password are required", { status: 400 });
    }

    const {
        data,
        error,
    } = await supabase.auth.verifyOtp({
        email,
        token: password,
        type: 'email',
    })


    if (error) {
        return new Response(error.message, { status: 500 });
    }

    const { access_token, refresh_token } = data.session;
    cookies.set("sb-access-token", access_token, {
        path: "/",
    });
    cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
    });
    return redirect("/dashboard");
};