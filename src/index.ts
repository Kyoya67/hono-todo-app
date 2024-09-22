import { Hono } from "hono";
import { basicAuth } from 'hono/basic-auth';
import { todos } from "./todos/api";
import { Bindings } from "./bindings";  // Bindingsをインポート

const app = new Hono<{ Bindings: Bindings }>();  // Bindingsを型パラメータとして追加

app.use(
    "/api/*",
    basicAuth({
        username: "kyoya",
        password: "noplan",
    })
);

app.route("/api/todos", todos);

export default app;