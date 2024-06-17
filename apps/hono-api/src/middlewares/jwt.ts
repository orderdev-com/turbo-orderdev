import { createMiddleware } from 'hono/factory'
import { errors, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);

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
    const jwtToken = c.req.query('jwt') || c.req.header('jwt') || null;
    if (jwtToken) {
        const jwtResult = await checkJWT(jwtToken);
        c.set('jwtResult', jwtResult);
    } else {
        c.set('jwtResult', null);
    }
    await next()
})

export type JWTResult = ReturnType<typeof checkJWT>