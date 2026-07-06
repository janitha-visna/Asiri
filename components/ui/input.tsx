import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputProps
>(({ className, placeholderTextColor, ...props }, ref) => (
  <TextInput
    ref={ref}
    className={cn(
      "rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
      className
    )}
    placeholderTextColor={placeholderTextColor || "#a1a1a1"}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
