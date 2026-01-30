"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  showText = true,
  text = "Loading",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-blue-500 border-t-transparent",
          sizeClasses[size],
        )}
      />

      {showText && <p className="font-medium text-sm text-white">{text}</p>}
    </div>
  );
}

interface PomodoroLoadingProps {
  className?: string;
}

export function PomodoroLoading({ className }: PomodoroLoadingProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen items-center justify-center",
        "bg-black", // Black background for bars
        className,
      )}
    >
      {/* Luffy One Piece Short image with black bars */}
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://vfid4uy2hm.ufs.sh/f/wYVOwdDPjrQvLbUPMuQ12oOYTlbZpPLegCv43I9u6xjhUJiK')",
        }}
      />

      {/* Overlay with backdrop blur for better spinner visibility */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Loading spinner on top */}
      <div className="relative z-10">
        <LoadingSpinner
          size="md"
          text="Loading Pomofocus"
          className="text-white"
        />
      </div>
    </div>
  );
}
