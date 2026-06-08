import { Elysia } from "elysia";
import { listsRoutes } from "@/routes/lists";
import { tasksRoutes } from "@/routes/tasks";

const app = new Elysia().use(listsRoutes).use(tasksRoutes).listen(3000);

console.log(`Rova running at ${app.server?.hostname}:${app.server?.port}`);
