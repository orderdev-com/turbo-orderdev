import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// User schema
const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
})

type User = z.infer<typeof UserSchema>

// In-memory users array
let users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
]

const app = new Hono()
    .get(
        '/',
        (c) => {
            return c.json(users, 200)
        }
    )
    .post(
        '/',
        zValidator('json', UserSchema),
        (c) => {
            const user = c.req.valid('json')
            users.push(user)
            return c.json(user, 201)
        }
    )
    .put(
        '/:id',
        zValidator('param', z.object({ id: z.number() })),
        zValidator('json', UserSchema),
        (c) => {
            const { id } = c.req.valid('param')
            const user = c.req.valid('json')
            const index = users.findIndex(u => u.id === id)
            if (index === -1) {
                return c.json({ error: 'User not found' }, 404)
            }
            users[index] = user
            return c.json(user, 200)
        }
    )
    .delete(
        '/:id',
        zValidator('param', z.object({ id: z.number() })),
        (c) => {
            const { id } = c.req.valid('param')
            const index = users.findIndex(u => u.id === id)
            if (index === -1) {
                return c.json({ error: 'User not found' }, 404)
            }
            const user = users.splice(index, 1)[0]
            return c.json(user, 200)
        }
    )

export default app