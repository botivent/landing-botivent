import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Sun, Moon, Monitor } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

export default function ToggleDarkMode() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="flex flex-row justify-center gap-2">
    { isMounted && (
        <ToggleGroup 
          type="single" 
          value={theme} 
          onValueChange={(value) => value && setTheme(value)}
          className="h-auto w-auto mt-2 border rounded-md"
        >
          <ToggleGroupItem value="light" className={ theme === "light" ? "bg-foreground/70 rounded-md text-background h-full  p-4 hover:bg-foreground/90 hover:text-background" : "h-full  p-4"}>
            <Sun className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="dark" className={ theme === "dark" ? "bg-foreground/70 rounded-md text-background h-full  p-4 hover:bg-foreground/90 hover:text-background" : "h-full  p-4"}>
            <Moon className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem value="system" className={ theme === "system" ? "bg-foreground/70 rounded-md text-background h-full p-4 hover:bg-foreground/90 hover:text-background" : "h-full p-4"}>
            <Monitor className="h-3 w-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      )}
      { !isMounted && (
        <Skeleton className="h-10 w-full mt-2" />
      )}
   </div>
  )
}