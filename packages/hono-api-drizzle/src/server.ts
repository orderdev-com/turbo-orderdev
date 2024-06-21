import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { type z } from 'zod';
import { postsApp } from './posts';
import { usersApp } from './users';
import { JWTResult, verfyJWT } from './middlewares/jwt'

type Variables = {
	jwtResult: JWTResult,
	supabaseUser: import("@supabase/supabase-js").User,
	// supabaseSession: import("@supabase/supabase-js").Session
}

export const app = new Hono<{ Variables: Variables }>();
app.use(verfyJWT);

app.onError((err, ctx) => {
	if ('format' in err) {
		console.error(JSON.stringify((err as z.ZodError).format(), undefined, 2));
	} else {
		console.error(err);
	}
	return ctx.json({ error: 'Internal Server Error' }, 500);
});

app.use('*', cors());


const routes = app.basePath('/api')
	.route('/posts', postsApp)
	.route('/users', usersApp)


export type AppType = typeof routes;