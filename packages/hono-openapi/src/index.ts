import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi"; // <- add createRoute
import { z } from "zod"; // <- add zod
import { app as appFoo } from "./foo"; // <- import route here

const app = new OpenAPIHono();
app.route("/foo", appFoo);

// The openapi.json will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

// basic route
// ------ added code -------
const basicRoute = createRoute({
  method: "get",
  path: "/basic/",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            hello: z.string(),
          }),
        },
      },
      description: "say hello",
    },
  },
});

app.openapi(basicRoute, (c) => {
  return c.json({ hello: "world" }, 200);
});
// ------ end added code -------

// swagger ui doc will be available at {server url}/ui
// fell free to change the url
// swaggerUI url must have same path as openapi.json
app.get("/ui", swaggerUI({ url: "/doc" }));

const port = 8001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});