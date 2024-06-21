import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()
    .post(
        '/',
        zValidator(
            'json',
            z.object({
                name: z.string()
            })
        ),
        (c) => {
            const { name } = c.req.valid('json')
            if (!name) {
                return c.json({
                    error: 'Name is required!'
                }, 500) // status is typed with hono
            }
            return c.json({
                message: `hi ${name}!, hello-kerem`
            }, 200)
        }
    )

export default app