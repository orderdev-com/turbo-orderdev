import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { JWTResult, verfyJWT } from './middlewares/jwt'


console.log("process.env.SUPABASE_JWT_SECRET")
console.log(process.env.SUPABASE_JWT_SECRET)

type Variables = {
  jwtResult: JWTResult
}
const app = new Hono<{ Variables: Variables }>()
app.use(verfyJWT);

app.get('/', async (c) => {
  return c.text(`${JSON.stringify(c.get('jwtResult'), null, 2)}`)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
