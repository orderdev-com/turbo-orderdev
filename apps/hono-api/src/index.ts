import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { errors, jwtVerify } from "jose";
const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);


console.log("process.env.SUPABASE_JWT_SECRET")
console.log(process.env.SUPABASE_JWT_SECRET)

const app = new Hono()

async function verifyJWT(jwt: string) {
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

app.get('/', async (c) => {
  // const jwt = c.req.header('jwt');
  const jwt = c.req.query('jwt') || c.req.header('jwt') || '';
  const jwtVerifyResult = await verifyJWT(jwt);
  console.log("jwtVerifyResult");
  console.log(jwtVerifyResult);
  return c.text(`${JSON.stringify(jwtVerifyResult, null, 2)}`)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
