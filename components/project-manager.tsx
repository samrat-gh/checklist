"use client";

import { useMutation, useQuery } from "convex/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";

const PROJECT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

export function ProjectManager() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[5]);

  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  const removeProject = useMutation(api.projects.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createProject({ name: name.trim(), color });
    setName("");
    setColor(PROJECT_COLORS[5]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          Manage Projects
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle>Projects</DialogTitle>
        </DialogHeader>

        {/* Existing projects */}
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {projects?.length === 0 && (
            <p className="py-4 text-center text-muted-foreground text-sm">
              No projects yet
            </p>
          )}
          {projects?.map((project) => (
            <div
              key={project._id}
              className="flex items-center justify-between rounded-md bg-secondary/50 p-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: project.color || "#6b7280" }}
                />
                <span className="text-sm">{project.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => removeProject({ id: project._id })}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add new project */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 border-border border-t pt-4"
        >
          <Input
            placeholder="New project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Color:</span>
            <div className="flex gap-1">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-5 w-5 rounded-full transition-all ${
                    color === c
                      ? "ring-2 ring-white/50 ring-offset-2 ring-offset-card"
                      : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!name.trim()}
            className="w-full"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Project
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
