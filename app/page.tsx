"use client";

import { useQuery } from "convex/react";
import { SquareCheckBig } from "lucide-react";
import { useState } from "react";
import { AddTaskForm } from "@/components/add-task-form";
import { ProjectManager } from "@/components/project-manager";
import { TaskItem } from "@/components/task-item";
import { api } from "@/convex/_generated/api";

type FilterStatus = "all" | "open" | "in-progress" | "closed";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filteredTasks = tasks?.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const taskCounts = {
    all: tasks?.length ?? 0,
    open: tasks?.filter((t) => t.status === "open").length ?? 0,
    "in-progress": tasks?.filter((t) => t.status === "in-progress").length ?? 0,
    closed: tasks?.filter((t) => t.status === "closed").length ?? 0,
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="mb-1 flex items-center font-semibold text-2xl tracking-tight">
            <SquareCheckBig className="my-1 mr-2 inline-block" size={26} />
            Checklist
          </h1>
          <p className="text-muted-foreground text-sm">
            Personal task management tool
          </p>
        </header>

        {/* Actions bar */}
        <div className="mb-6 flex items-center justify-between">
          <AddTaskForm />
          <ProjectManager />
        </div>

        {/* Filter tabs */}
        <div className="mb-6 flex w-fit items-center gap-1 rounded-lg bg-secondary/30 p-1">
          {(["all", "open", "in-progress", "closed"] as const).map((status) => (
            <button
              type="button"
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-md px-3 py-1.5 font-medium text-xs transition-colors ${
                filter === status
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "all"
                ? "All"
                : status === "in-progress"
                  ? "In Progress"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-muted-foreground">
                {taskCounts[status]}
              </span>
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2">
          {!tasks && (
            <div className="py-12 text-center text-muted-foreground">
              Loading...
            </div>
          )}

          {filteredTasks?.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              {filter === "all"
                ? "No tasks yet. Add one to get started!"
                : `No ${filter === "in-progress" ? "in progress" : filter} tasks`}
            </div>
          )}

          {filteredTasks?.map((task) => (
            <TaskItem
              key={task._id}
              task={{ ...task, project: task.project ?? null }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
