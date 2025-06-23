import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  // タスク一覧取得
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // タスク作成
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
        },
      });
    }),

  // タスク更新
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.task.update({
        where: { id },
        data: updateData,
      });
    }),

  // タスク削除
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),

  // 完了状態切り替え
  toggle: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
      });
      
      if (!task) {
        throw new Error("Task not found");
      }

      return ctx.db.task.update({
        where: { id: input.id },
        data: { completed: !task.completed },
      });
    }),
});
