"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function ThemeMenuItem() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenuItem onClick={toggleTheme} className="gap-2">
      {theme === "dark" ? (
        <>
          <Sun className="size-4" />
          Light
        </>
      ) : (
        <>
          <Moon className="size-4" />
          Dark
        </>
      )}
    </DropdownMenuItem>
  );
}