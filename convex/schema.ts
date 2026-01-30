import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    color: v.optional(v.string()),
  }),

  tasks: defineTable({
    text: v.string(),
    projectId: v.optional(v.id("projects")),
    status: v.union(
      v.literal("open"),
      v.literal("in-progress"),
      v.literal("closed"),
    ),
    scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()),
    timerStartedAt: v.optional(v.number()),
    totalTimeSpent: v.number(),
    createdAt: v.number(),
  }).index("by_status", ["status"]),
});
