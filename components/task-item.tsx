"use client";

import { useMutation, useQuery } from "convex/react";
import { Calendar, Check, Circle, Clock, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Timer } from "@/components/timer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

type TaskStatus = "open" | "in-progress" | "closed";

interface TaskWithProject {
  _id: Id<"tasks">;
  _creationTime: number;
  text: string;
  status: TaskStatus;
  projectId?: Id<"projects">;
  scheduledDate?: string;
  scheduledTime?: string;
  timerStartedAt?: number;
  totalTimeSpent: number;
  createdAt: number;
  project: Doc<"projects"> | null;
}

interface TaskItemProps {
  task: TaskWithProject;
}

const STATUS_CONFIG = {
  open: {
    icon: Circle,
    label: "Open",
    className: "text-muted-foreground hover:text-foreground",
    next: "in-progress" as TaskStatus,
  },
  "in-progress": {
    icon: Clock,
    label: "In Progress",
    className: "text-yellow-500 hover:text-yellow-400",
    next: "closed" as TaskStatus,
  },
  closed: {
    icon: Check,
    label: "Closed",
    className: "text-green-500 hover:text-green-400",
    next: "open" as TaskStatus,
  },
};

export function TaskItem({ task }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editProjectId, setEditProjectId] = useState(task.projectId || "");
  const [editDate, setEditDate] = useState(task.scheduledDate || "");
  const [editTime, setEditTime] = useState(task.scheduledTime || "");

  const updateStatus = useMutation(api.tasks.updateStatus);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);
  const projects = useQuery(api.projects.get);

  const statusConfig = STATUS_CONFIG[task.status];
  const StatusIcon = statusConfig.icon;

  const handleStatusClick = () => {
    updateStatus({ id: task._id, status: statusConfig.next });
  };

  const handleStartEdit = () => {
    setEditText(task.text);
    setEditProjectId(task.projectId || "");
    setEditDate(task.scheduledDate || "");
    setEditTime(task.scheduledTime || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;

    await updateTask({
      id: task._id,
      text: editText.trim(),
      projectId: editProjectId ? (editProjectId as Id<"projects">) : null,
      scheduledDate: editDate || null,
      scheduledTime: editTime || null,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const formatDate = (dateStr: string, timeStr?: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let dateLabel: string;
    if (date.toDateString() === today.toDateString()) {
      dateLabel = "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (timeStr) {
      const [hours, minutes] = timeStr.split(":");
      const time = new Date();
      time.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      dateLabel += ` at ${time.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
    }

    return dateLabel;
  };

  return (
    <div
      className={`group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-muted ${
        task.status === "closed" ? "opacity-60" : ""
      }`}
    >
      {/* Status toggle */}
      <button
        type="button"
        onClick={handleStatusClick}
        className={`mt-0.5 rounded p-1 transition-colors ${statusConfig.className}`}
        title={`Status: ${statusConfig.label}. Click to change.`}
      >
        <StatusIcon className="h-4 w-4" />
      </button>

      {/* Task content */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8 text-sm"
            />
            <div className="flex gap-2">
              <Select
                value={editProjectId}
                onChange={(e) => setEditProjectId(e.target.value)}
                className="h-7 flex-1 text-xs"
              >
                <option value="">No project</option>
                {projects?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Select>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="h-7 w-32 text-xs"
              />
              <Input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="h-7 w-24 text-xs"
              />
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={handleSaveEdit}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`text-sm ${
                task.status === "closed"
                  ? "text-muted-foreground line-through"
                  : ""
              }`}
            >
              {task.text}
            </p>

            {/* Meta info */}
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              {task.project && (
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: task.project.color || "#6b7280" }}
                  />
                  {task.project.name}
                </span>
              )}

              {task.scheduledDate && (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.scheduledDate, task.scheduledTime)}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Timer */}
      {task.status !== "closed" && !isEditing && (
        <Timer
          taskId={task._id}
          timerStartedAt={task.timerStartedAt}
          totalTimeSpent={task.totalTimeSpent}
        />
      )}

      {/* Time spent badge for closed tasks */}
      {task.status === "closed" && task.totalTimeSpent > 0 && !isEditing && (
        <span className="font-mono text-muted-foreground text-xs">
          {formatTimeSpent(task.totalTimeSpent)}
        </span>
      )}

      {/* Edit button */}
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
          onClick={handleStartEdit}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      )}

      {/* Delete button */}
      {!isEditing && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-6 w-6 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          onClick={() => removeTask({ id: task._id })}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}

function formatTimeSpent(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
}
