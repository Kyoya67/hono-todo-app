import { Hono } from "hono";
import { validation } from "@honojs/validator";

let todoList = [
    { id: "1", title: "Learning Hono", completed: false },
    { id: "2", title: "Watch the movie", completed: true },
    { id: "3", title: "Buy milk", completed: false },
];

const todos = new Hono();
todos.get("/", (c) => c.json(todoList));

todos.post(
    "/",
    validation((v, message) => ({
        body: {
            title: [v.trim, [v.required, message("Title is required")]],
        },
    })) as any,
    async (c) => {
        try {
            const param = await c.req.json<{ title: string }>();
            const newTodo = {
                id: String(todoList.length + 1),
                completed: false,
                title: param.title,
            };
            todoList = [...todoList, newTodo];
            return c.json(newTodo, 201);
        } catch (error) {
            console.error(error);
            return c.text('Error processing request', 400);
        }
    });

todos.put("/:id", async (c) => {
    const id = c.req.param("id");
    console.log("Updating todo with id:", id);  // デバッグログ

    const todo = todoList.find((todo) => todo.id === id);
    if (!todo) {
        console.log("Todo not found");  // デバッグログ
        return c.json({ message: "not found" }, 404);
    }

    const param = await c.req.json();  // parseBody()の代わりにjson()を使用
    console.log("Received update data:", param);  // デバッグログ

    todoList = todoList.map((todo) => {
        if (todo.id === id) {
            console.log("Updating todo:", { ...todo, ...param });  // デバッグログ
            return { ...todo, ...param };
        } else {
            return todo;
        }
    });

    console.log("Updated todoList:", todoList);  // デバッグログ

    return c.json({ message: "Todo updated successfully" }, 200);  // 明示的な成功メッセージを返す
});

todos.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const todo = todoList.find((todo) => todo.id === id);
    if (!todo) {
        return c.json({ message: "not found" }, 404);
    }
    todoList = todoList.filter((todo) => todo.id !== id);

    return new Response(null, { status: 204 });
});

export { todos };
