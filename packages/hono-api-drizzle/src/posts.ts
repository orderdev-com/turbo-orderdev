import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm';
import { insertPostSchema, posts, selectPostSchema } from './schema';
import { db } from './db';

export const postsApp = new Hono();

export const listPostsResponse = selectPostSchema.array();

postsApp.get('/', async (ctx) => {
    const allPosts = await db.select().from(posts).all();
    return ctx.json(listPostsResponse.parse(allPosts));
});

const insertPostRequest = insertPostSchema.pick({
    title: true,
    body: true,
    authorId: true,
});
const insertPostResponse = selectPostSchema;

postsApp.post('/', zValidator('json', insertPostRequest), async (ctx) => {
    const data = ctx.req.valid('json');
    const post = await db.insert(posts).values(data).returning().get();
    return ctx.json(insertPostResponse.parse(post));
});

const updatePostRequest = insertPostRequest.pick({ title: true, body: true }).partial();
const updatePostResponse = selectPostSchema;

postsApp.patch('/:id', zValidator('json', updatePostRequest), async (ctx) => {
    const data = ctx.req.valid('json');
    const post = await db
        .update(posts)
        .set(data)
        .where(eq(posts.id, +ctx.req.param('id')))
        .returning()
        .get();
    return ctx.json(updatePostResponse.parse(post));
});

const getPostResponse = selectPostSchema;

postsApp.get('/:id', async (ctx) => {
    const post = await db
        .select()
        .from(posts)
        .where(eq(posts.id, +ctx.req.param('id')))
        .get();
    return ctx.json(getPostResponse.parse(post));
});

const deletePostResponse = selectPostSchema.pick({ id: true });

postsApp.delete('/:id', async (ctx) => {
    const post = await db
        .delete(posts)
        .where(eq(posts.id, +ctx.req.param('id')))
        .returning({ id: posts.id })
        .get();
    return ctx.json(deletePostResponse.parse(post));
});
