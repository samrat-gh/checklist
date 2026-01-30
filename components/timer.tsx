"use client";

import { useMutation } from "convex/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface TimerProps {
  taskId: Id<"tasks">;
  timerStartedAt: number | undefined;
  totalTimeSpent: number;
}

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const displayHours = hours;
  const displayMinutes = minutes % 60;
  const displaySeconds = seconds % 60;

  if (hours > 0) {
    return `${displayHours}h ${displayMinutes.toString().padStart(2, "0")}m`;
  }
  if (minutes > 0) {
    return `${displayMinutes}m ${displaySeconds.toString().padStart(2, "0")}s`;
  }
  return `${displaySeconds}s`;
}

export function Timer({ taskId, timerStartedAt, totalTimeSpent }: TimerProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const startTimer = useMutation(api.tasks.startTimer);
  const stopTimer = useMutation(api.tasks.stopTimer);

  const isRunning = !!timerStartedAt;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const elapsed = isRunning
    ? totalTimeSpent + (currentTime - timerStartedAt)
    : totalTimeSpent;

  const handleToggle = () => {
    if (isRunning) {
      stopTimer({ id: taskId });
    } else {
      startTimer({ id: taskId });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-mono text-xs tabular-nums ${isRunning ? "text-green-400" : "text-muted-foreground"}`}
      >
        {formatTime(elapsed)}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleToggle}
        className={`h-6 w-6 ${isRunning ? "text-green-400 hover:text-green-300" : "text-muted-foreground hover:text-foreground"}`}
      >
        {isRunning ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
