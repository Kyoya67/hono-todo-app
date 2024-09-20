import { Hono } from "hono";
import { basicAuth } from 'hono/basic-auth';
import { todos } from "./todos/api";

const app = new Hono();
app.use(
    "/api/*",
    basicAuth({
        username: "charizard",
        password: "super-secret",
    })
);
app.route("/api/todos", todos);

export default app;