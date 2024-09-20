import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

let todoList = [
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: false },
];

const todos = new Hono();

// GET all todos
todos.get("/", (c) => c.json(todoList));

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
        try {
            const { title } = c.req.valid('json');
            const newTodo = {
                id: String(todoList.length + 1),
                completed: false,
                title: title.trim(),
            };
            todoList = [...todoList, newTodo];
            return c.json(newTodo, 201);
        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                return c.json({ error: error.errors }, 400);
            }
            return c.text('Error processing request', 500);
        }
    }
);

// PUT (update) todo
todos.put(
    "/:id",
    zValidator("json", todoSchema),
    async (c) => {
        const id = c.req.param("id");
        console.log("Updating todo with id:", id);

        const todoIndex = todoList.findIndex((todo) => todo.id === id);
        if (todoIndex === -1) {
            console.log("Todo not found");
            return c.json({ message: "not found" }, 404);
        }

        try {
            const { title } = c.req.valid('json');
            console.log("Received update data:", { title });

            todoList[todoIndex] = {
                ...todoList[todoIndex],
                title: title.trim()
            };

            console.log("Updated todo:", todoList[todoIndex]);
            console.log("Updated todoList:", todoList);

            return c.json({ message: "Todo updated successfully", todo: todoList[todoIndex] }, 200);
        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                return c.json({ error: error.errors }, 400);
            }
            return c.text('Error processing request', 500);
        }
    }
);

// DELETE todo
todos.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const todoIndex = todoList.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
        return c.json({ message: "not found" }, 404);
    }
    todoList.splice(todoIndex, 1);
    return new Response(null, { status: 204 });
});

export { todos };