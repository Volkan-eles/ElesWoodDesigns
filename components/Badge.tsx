import { cn } from "@/lib/utils";
import React from "react";

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("badge-neo", className)}>
      {children}
    </span>
  );
}
