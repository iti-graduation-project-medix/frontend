import * as React from "react";
import { Textarea } from "../textarea";
import { cn } from "../../../lib/utils";

const ChatInput = React.forwardRef(({ className, ...props }, ref) => (
  <Textarea
    autoComplete="off"
    ref={ref}
    name="message"
    rows={1}
    className={cn(
      "min-h-[40px] max-h-32 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md resize-none overflow-y-auto",
      className
    )}
    {...props}
  />
));
ChatInput.displayName = "ChatInput";

export { ChatInput };
