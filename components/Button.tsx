import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyles = "btn-neo";
  const secondaryStyles = "bg-white border-2 border-black shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-bold px-6 py-3 flex items-center justify-center gap-2";
  
  return (
    <button
      className={cn(variant === "primary" ? baseStyles : secondaryStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
}
