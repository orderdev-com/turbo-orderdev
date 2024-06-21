import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()
    .get(
        '/',
        zValidator(
            'query',
            z.object({
                name: z.string()
            })
        ),
        (c) => {
            const { name } = c.req.valid('query')
            if (!name) {
                return c.json({
                    error: 'Name is required!'
                }, 500) // status is typed with hono
            }
            return c.json({
                message: `Hello ${name}!`
            }, 200)
        }
    )

export default app