import { Elysia } from "elysia";
import { openapi } from "@elysia/openapi";
import { listsRoutes } from "@/routes/lists";
import { tasksRoutes } from "@/routes/tasks";

const app = new Elysia()
  .use(openapi())
  .use(listsRoutes)
  .use(tasksRoutes)
  .get("/", "Rova is running, visit /openapi for documentation")
  .listen(3000);

console.log(`Rova running at ${app.server?.hostname}:${app.server?.port}`);
