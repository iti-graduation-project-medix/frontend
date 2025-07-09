import * as React from "react";
import { Textarea } from "../textarea";
import { cn } from "../../../lib/utils";

export function ChatInput({ className = "", ...props }) {
  return (
    <textarea
      className={
        `w-full relative z-10 bg-white border border-border rounded-2xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none min-h-[48px] max-h-32 backdrop-blur-sm ` +
        className
      }
      rows={1}
      {...props}
    />
  );
}
