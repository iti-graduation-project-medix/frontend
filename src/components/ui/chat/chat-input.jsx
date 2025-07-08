import * as React from "react";
import { Textarea } from "../textarea";
import { cn } from "../../../lib/utils";

export function ChatInput({ className = "", ...props }) {
  return (
    <textarea
      className={
        `w-full relative z-10 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none min-h-[48px] max-h-32 backdrop-blur-sm ` +
        className
      }
      rows={1}
      {...props}
    />
  );
}
