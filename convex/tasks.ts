import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all tasks with project info
export const get = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").order("desc").collect();
    const projects = await ctx.db.query("projects").collect();

    return tasks.map((task) => ({
      ...task,
      project: task.projectId
        ? projects.find((p) => p._id === task.projectId)
        : null,
    }));
  },
});

// Create a new task
export const create = mutation({
  args: {
    text: v.string(),
    projectId: v.optional(v.id("projects")),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", {
      text: args.text,
      projectId: args.projectId,
      status: "open",
      scheduledDate: args.scheduledDate,
      scheduledTime: args.scheduledTime,
      totalTimeSpent: 0,
      createdAt: Date.now(),
    });
  },
});

// Update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("open"),
      v.literal("in-progress"),
      v.literal("closed"),
    ),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");

    // If closing a task with active timer, stop it first
    let totalTimeSpent = task.totalTimeSpent;
    if (args.status === "closed" && task.timerStartedAt) {
      totalTimeSpent += Date.now() - task.timerStartedAt;
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      timerStartedAt:
        args.status === "closed" ? undefined : task.timerStartedAt,
      totalTimeSpent,
    });
  },
});

// Start timer for a task
export const startTimer = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (task.timerStartedAt) return; // Already running

    await ctx.db.patch(args.id, {
      timerStartedAt: Date.now(),
      status: "in-progress",
    });
  },
});

// Stop timer for a task
export const stopTimer = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) throw new Error("Task not found");
    if (!task.timerStartedAt) return; // Not running

    const elapsed = Date.now() - task.timerStartedAt;
    await ctx.db.patch(args.id, {
      timerStartedAt: undefined,
      totalTimeSpent: task.totalTimeSpent + elapsed,
    });
  },
});

// Delete a task
export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Update task details
export const update = mutation({
  args: {
    id: v.id("tasks"),
    text: v.optional(v.string()),
    projectId: v.optional(v.union(v.id("projects"), v.null())),
    scheduledDate: v.optional(v.union(v.string(), v.null())),
    scheduledTime: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleanUpdates: Record<string, unknown> = {};

    if (updates.text !== undefined) cleanUpdates.text = updates.text;
    if (updates.projectId !== undefined) {
      cleanUpdates.projectId =
        updates.projectId === null ? undefined : updates.projectId;
    }
    if (updates.scheduledDate !== undefined) {
      cleanUpdates.scheduledDate =
        updates.scheduledDate === null ? undefined : updates.scheduledDate;
    }
    if (updates.scheduledTime !== undefined) {
      cleanUpdates.scheduledTime =
        updates.scheduledTime === null ? undefined : updates.scheduledTime;
    }

    await ctx.db.patch(id, cleanUpdates);
  },
});
