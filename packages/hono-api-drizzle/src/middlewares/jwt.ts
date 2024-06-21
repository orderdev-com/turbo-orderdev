import { createMiddleware } from 'hono/factory'
import { errors, jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

const secret = new TextEncoder().encode(process.env['SUPABASE_JWT_SECRET']);

async function checkJWT(jwt: string) {
    try {
        const jwtVerifyResult = await jwtVerify(jwt, secret);
        console.log("jwtVerifyResult");
        console.log(jwtVerifyResult);
        return {
            status: "authorized",
            payload: jwtVerifyResult.payload,
            msg: "successfully verified auth token",
        } as const;
    } catch (err) {
        console.log("jwtVerify error");
        console.log(err);
        if (err instanceof errors.JOSEError) {
            return { status: "error", msg: err.message } as const;
        }

        console.debug(err);
        return { status: "error", msg: "could not validate auth token" } as const;
    }
}

export const verfyJWT = createMiddleware(async (c, next) => {
    const jwtToken = c.req.query('Authorization') || c.req.header('Authorization') || null;
    console.log("jwtToken");
    console.log(jwtToken);
    if (jwtToken) {
        const supabase = createClient(
            process.env['SUPABASE_URL']!,
            process.env['SUPABASE_ANON_KEY']!,
            {
                global: {
                    headers: {
                        // 'Authorization': `Bearer ${jwtToken}`
                        'Authorization': `${jwtToken}`
                    }
                }
            }
        );
        c.set('supabaseUser', (await supabase.auth.getUser()).data.user);
    } else {
        c.set('supabaseUser', null);
    }
    // if (jwtToken) {


    //     c.set('jwtResult', await checkJWT(jwtToken));
    //     c.set('supabaseUser', (await supabase.auth.getUser()).data.user);
    //     // c.set('supabaseUser', (await supabase.auth.getUser(jwtToken)).data.user); // or add JWT inside getUser
    //     c.set('supabaseSession', (await supabase.auth.getSession()).data.session);
    // } else {
    //     c.set('jwtResult', null);
    //     c.set('supabaseUser', null);
    // }
    await next()
})

export type JWTResult = ReturnType<typeof checkJWT>