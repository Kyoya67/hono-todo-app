import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
    createTodo,
    CreateTodo,
    deleteTodo,
    getTodo,
    getTodos,
    updateTodo,
    UpdateTodo,
} from "./model";
import { Bindings } from "../bindings";

const todos = new Hono<{ Bindings: Bindings }>();

// GET all todos
todos.get("/", async (c) => {
    const todos = await getTodos(c.env.HONO_TODO);
    return c.json(todos);
});

// Define the schema for todo creation and update
const todoSchema = z.object({
    title: z.string().min(1).refine(value => value.trim().length > 0, {
        message: "Title cannot be empty or contain only whitespace"
    })
});

// POST new todo
todos.post(
    "/",
    zValidator("json", todoSchema),
    async (c) => {
        const param = await c.req.json<CreateTodo>();
        const newTodo = await createTodo(c.env.HONO_TODO, param);

        return c.json(newTodo, 201);
    }
);

todos.put("/:id", async (c) => {
    const id = c.req.param("id");
    const todo = await getTodo(c.env.HONO_TODO, id);
    if (!todo) {
        return c.json({ message: "not found" }, 404);
    }
    const param = await c.req.json<UpdateTodo>();
    await updateTodo(c.env.HONO_TODO, id, param);
    return new Response(null, { status: 204 });
});

todos.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const todo = await getTodo(c.env.HONO_TODO, id);
    if (!todo) {
        return c.json({ message: "not found" }, 404);
    }

    await deleteTodo(c.env.HONO_TODO, id);

    return new Response(null, { status: 204 });
});

export { todos };