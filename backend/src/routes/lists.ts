import { Elysia, t } from "elysia";
import { eq } from "drizzle-orm";
import { db } from "@/db/index";
import { lists, tasks } from "@/db/schema";

export const listsRoutes = new Elysia()
  .get("/lists", () => db.query.lists.findMany())

  .post(
    "/lists",
    async ({ body }) => {
      const result = await db.insert(lists).values(body).returning();
      return result[0];
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  )

  .get(
    "/lists/:listid",
    ({ params: { listid } }) => {
      return db.query.lists.findFirst({
        where: eq(lists.id, listid),
      });
    },
    {
      params: t.Object({
        listid: t.Number(),
      }),
    },
  )

  .patch(
    "/lists/:listid",
    async ({ params: { listid }, body, set }) => {
      const updated = await db
        .update(lists)
        .set({
          ...(body.name !== undefined && { name: body.name }),
        })
        .where(eq(lists.id, listid))
        .returning();

      if (!updated.length) {
        set.status = 404;
        return { error: "List not found" };
      }

      return updated[0];
    },
    {
      params: t.Object({
        listid: t.Number(),
      }),
      body: t.Partial(
        t.Object({
          name: t.String(),
        }),
      ),
    },
  )

  .delete(
    "/lists/:listid",
    async ({ params: { listid } }) => {
      await db.delete(lists).where(eq(lists.id, listid));
      return { success: true };
    },
    {
      params: t.Object({
        listid: t.Number(),
      }),
    },
  );
