import { Hono } from "hono";
import { todos } from "./todos/api";

const app = new Hono();
app.route("/api/todos", todos);

export default app;