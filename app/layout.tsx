import type { Metadata } from "next";
import "./globals.css";

import { ConvexClientProvider } from "@/components/convex-client-provider";

export const metadata: Metadata = {
  title: "Checklist | Personal Task Manager",
  description: "A minimal personal task management tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
