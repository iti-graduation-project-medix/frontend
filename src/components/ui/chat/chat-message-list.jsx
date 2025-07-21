import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "../button";

export const ChatMessageList = React.forwardRef(function ChatMessageList(
  { className = "", children, ...props },
  ref
) {
  const innerRef = React.useRef();
  const scrollRef = ref || innerRef;
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);

  // Show button if not at bottom
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 60);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    // Check on mount
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollRef]);

  // Scroll to bottom
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div className={"relative h-full w-full " + className}>
      <div
        ref={scrollRef}
        className={
          "flex flex-col gap-2 px-2 py-1 h-full overflow-y-auto custom-scrollbar w-full "
        }
        {...props}
      >
        {children}
      </div>
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute left-1/2 cursor-pointer -translate-x-1/2 bottom-4 z-20 p-2 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white dark:text-white shadow-xl hover:scale-110 transition-all border-2 border-border dark:border-border backdrop-blur-lg pointer-events-auto"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

ChatMessageList.displayName = "ChatMessageList";
