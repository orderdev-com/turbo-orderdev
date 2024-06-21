import { Hono } from 'hono'
import { OpenAPIHono, z, createRoute } from '@hono/zod-openapi'
import { zValidator } from '@hono/zod-validator'
import { swaggerUI } from '@hono/swagger-ui'
// import { z } from 'zod'

// User schema
const UserSchema = z.object({
    id: z
        .string()
        .min(3)
        .openapi({
            param: {
                name: 'id',
                in: 'path',
            },
            example: '1001',
        }),
    name: z.string(),
    email: z.string().email(),
})

const ParamsSchema = z.object({
    id: z
        .string()
        .min(3)
        .openapi({
            param: {
                name: 'id',
                in: 'path',
            },
            example: '1001',
        }),
})



const route = createRoute({
    method: 'get',
    path: '/api/users/{id}',
    request: {
        params: ParamsSchema,
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: UserSchema,
                },
            },
            description: 'Retrieve the user',
        },
    },
})

export const openapiApp = new OpenAPIHono()

// openapiApp.openapi(route, (c) => {
//     const { id } = c.req.valid('param')
//     return c.json(
//         {
//             id,
//             name: 'Ultra-man',
//             email: 'ultra@example.com',
//         },
//         200 // You should specify the status code even if it is 200.
//     )
// })

// The OpenAPI documentation will be available at /doc
openapiApp.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'My API',
    },
})

// Use the middleware to serve Swagger UI at /ui
openapiApp.get('/ui', swaggerUI({ url: '/api/openapi/doc' }))


type User = z.infer<typeof UserSchema>

// In-memory users array
let users: User[] = [
    { id: "1001", name: 'John Doe', email: 'john@example.com' },
    { id: "1002", name: 'Jane Doe', email: 'jane@example.com' },
]

export const usersApp = new Hono()
    .get(
        '/',
        (c) => {
            return c.json(users, 200)
        }
    )
    .get(
        ':id',
        zValidator('param', z.object({ id: UserSchema.shape.id })),
        (c) => {
            const { id } = c.req.valid('param')
            const user = users.find(u => u.id === id)
            if (!user) {
                return c.json({ error: 'User not found' }, 404)
            }
            return c.json(user, 200)
        }
    )
    .post(
        '/',
        zValidator('json', UserSchema),
        (c) => {
            const user = c.req.valid('json')
            const index = users.findIndex(u => u.id === user.id)
            if (index === -1) {
                users.push(user)
            } else {
                return c.json({ error: 'User already exists' }, 400)
            }
            return c.json(user, 201)
        }
    )
    .put(
        '/:id',
        zValidator('param', z.object({ id: UserSchema.shape.id })),
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
        zValidator('param', z.object({ id: UserSchema.shape.id })),
        (c) => {
            const { id } = c.req.valid('param')
            const index = users.findIndex(u => u.id === id)
            if (index === -1) {
                return c.json({ error: 'User not found' }, 404)
            }
            const user = users.splice(index, 1)[0]
            return c.json(user, 200)
        }
    );
