import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { insertUserSchema, posts, selectPostSchema, selectUserSchema, users } from './schema';
import { aggregateOneToMany } from './utils';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { listPostsResponse } from './posts';

const listUsersResponse = selectUserSchema.array();

const insertUserRequest = insertUserSchema.pick({
    name: true,
    email: true,
});
const insertUserResponse = selectUserSchema;

const updateUserRequest = insertUserRequest.partial();
const updateUserResponse = selectUserSchema;

const getUserResponse = selectUserSchema.extend({
    posts: selectPostSchema.array(),
});
const deleteUserResponse = selectUserSchema.pick({ id: true });

type Variables = {
    supabaseUser: import("@supabase/supabase-js").User,
}
export const usersApp = new Hono<{ Variables: Variables }>()
    .get('/', async (ctx) => {
        const allUsers = await db.select().from(users).all();
        return ctx.json({
            users: listUsersResponse.parse(allUsers),
            supabaseUser: ctx.get('supabaseUser'),
        });
    })
    .post('/', zValidator('json', insertUserRequest), async (ctx) => {
        const data = ctx.req.valid('json');
        const user = await db.insert(users).values(data).returning().get();
        return ctx.json(insertUserResponse.parse(user));
    })
    .patch('/:id', zValidator('json', updateUserRequest), async (ctx) => {
        const data = ctx.req.valid('json');
        const user = await db
            .update(users)
            .set(data)
            .where(eq(users.id, +ctx.req.param('id')))
            .returning()
            .get();
        return ctx.json(updateUserResponse.parse(user));
    })
    .get('/:id', async (ctx) => {
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, +ctx.req.param('id')))
            .leftJoin(posts, eq(users.id, posts.authorId))
            .all()
            .then((rows) => aggregateOneToMany(rows, 'users', 'posts')[0]);

        if (!user) return ctx.json({ error: 'User not found' }, 404);

        return ctx.json(getUserResponse.parse(user));
    })
    .get('/:id/posts', async (ctx) => {
        const allPosts = await db.select().from(posts).where(eq(posts.authorId, +ctx.req.param('id'))).all();
        return ctx.json(listPostsResponse.parse(allPosts));
    })
    .delete('/:id', async (ctx) => {
        const user = await db
            .delete(users)
            .where(eq(users.id, +ctx.req.param('id')))
            .returning({ id: users.id })
            .get();
        return ctx.json(deleteUserResponse.parse(user));
    });
