import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all projects
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

// Create a new project
export const create = mutation({
  args: {
    name: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", {
      name: args.name,
      color: args.color ?? "#6b7280",
    });
  },
});

// Delete a project
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    // Remove project reference from all tasks
    const tasks = await ctx.db.query("tasks").collect();
    for (const task of tasks) {
      if (task.projectId === args.id) {
        await ctx.db.patch(task._id, { projectId: undefined });
      }
    }
    await ctx.db.delete(args.id);
  },
});
