import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { tasks, lists } from "@/db/schema";

export const tasksRoutes = new Elysia()
  .get(
    "/lists/:listid/tasks",
    ({ params: { listid } }) => {
      return db.query.tasks.findMany({
        where: eq(tasks.listId, listid),
      });
    },
    {
      params: t.Object({
        listid: t.Number(),
      }),
    },
  )

  .post(
    "/lists/:listid/tasks",
    async ({ params: { listid }, body, set }) => {
      const list = await db.query.lists.findFirst({
        where: eq(lists.id, listid),
      });

      if (!list) {
        set.status = 404;
        return { error: "List not found" };
      }

      const result = await db
        .insert(tasks)
        .values({
          task: body.task,
          listId: listid,
        })
        .returning();

      return result[0];
    },
    {
      params: t.Object({
        listid: t.Number(),
      }),
      body: t.Object({
        task: t.String(),
      }),
    },
  )

  .get(
    "/tasks/:taskid",
    ({ params: { taskid } }) => {
      return db.query.tasks.findFirst({
        where: eq(tasks.id, taskid),
      });
    },
    {
      params: t.Object({
        taskid: t.Number(),
      }),
    },
  )

  .patch(
    "/tasks/:taskid",
    async ({ params: { taskid }, body, set }) => {
      const updated = await db
        .update(tasks)
        .set({
          ...(body.task !== undefined && { task: body.task }),
          ...(body.done !== undefined && { done: body.done }),
        })
        .where(eq(tasks.id, taskid))
        .returning();

      if (!updated.length) {
        set.status = 404;
        return { error: "Task not found" };
      }

      return updated[0];
    },
    {
      params: t.Object({
        taskid: t.Number(),
      }),
      body: t.Partial(
        t.Object({
          task: t.String(),
          done: t.Boolean(),
        }),
      ),
    },
  )

  .patch(
    "/tasks/:taskid/move",
    async ({ params: { taskid }, body }) => {
      return db
        .update(tasks)
        .set({
          listId: body.listId,
        })
        .where(eq(tasks.id, taskid))
        .returning();
    },
    {
      params: t.Object({
        taskid: t.Number(),
      }),
      body: t.Object({
        listId: t.Number(),
      }),
    },
  )

  .delete(
    "/tasks/:taskid",
    async ({ params: { taskid } }) => {
      await db.delete(tasks).where(eq(tasks.id, taskid));
      return { success: true };
    },
    {
      params: t.Object({
        taskid: t.Number(),
      }),
    },
  );
