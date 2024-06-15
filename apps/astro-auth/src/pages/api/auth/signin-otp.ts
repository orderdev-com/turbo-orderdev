import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
// import type { Provider } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
        return new Response("Email is required", { status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithOtp({
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