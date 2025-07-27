import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";
import React from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  // Toggle: if dark, go to light; if light or system, go to dark
  const handleToggle = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
