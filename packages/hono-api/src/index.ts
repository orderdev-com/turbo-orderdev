import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { Hono } from 'hono'
import { JWTResult, verfyJWT } from './middlewares/jwt'
import hello from './hello'
import hellokerem from './hellokerem'
import { usersApp, openapiApp } from './users'


console.log("process.env.SUPABASE_JWT_SECRET")
console.log(process.env.SUPABASE_JWT_SECRET)

type Variables = {
  jwtResult: JWTResult,
  supabaseUser: import("@supabase/supabase-js").User,
  supabaseSession: import("@supabase/supabase-js").Session
}
const app = new Hono<{ Variables: Variables }>()
app.use(verfyJWT);
/**
 * Options
 *  origin: string | string[] | (origin:string, c:Context) => string
 *  The value of "Access-Control-Allow-Origin" CORS header. You can also pass the callback function like origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com'). Default is *
 * 
 *  allowMethods: string[]
 *  The value of "Access-Control-Allow-Methods" CORS header. Default is ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']
 * 
 *  allowHeaders: string[]
 *  The value of "Access-Control-Allow-Headers" CORS header. Default is []
 * 
 *  maxAge: number
 *  The value of "Access-Control-Max-Age" CORS header.
 * 
 *  credentials: boolean
 *  The value of "Access-Control-Allow-Credentials" CORS header.
 * 
 *  exposeHeaders: string[]
 *  The value of "Access-Control-Expose-Headers" CORS header. Default is []
 */
app.use(cors({
  origin: '*',
  allowMethods: ['GET'],
  allowHeaders: [],
  // origin: string | string[] | ((origin: string, c: Context) => string | undefined | null);
  // allowMethods?: string[];
  // allowHeaders?: string[];
  // maxAge?: number;
  // credentials?: boolean;
  // exposeHeaders?: string[];
}))

const routes = app.basePath('/api')
  .route('/hello', hello)
  .route('/hellokerem', hellokerem)
  .route('/users', usersApp)
  .route('/openapi', openapiApp)

export type AppType = typeof routes

app.get('/', async (c) => {
  return c.text(`
    
    supabaseSession: 
    ${JSON.stringify(c.get('supabaseSession'), null, 2)}


    supabaseUser: 
    ${JSON.stringify(c.get('supabaseUser'), null, 2)}


    
    jwtResult:
    ${JSON.stringify(c.get('jwtResult'), null, 2)}
    `)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
