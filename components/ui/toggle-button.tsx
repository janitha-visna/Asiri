import * as React from "react";
import { Pressable, Text } from "react-native";
import { cn } from "@/lib/utils";

interface ToggleButtonProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  variant?: "default" | "outline";
}

const ToggleButton = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ToggleButtonProps
>(
  (
    {
      label,
      selected = false,
      onPress,
      disabled = false,
      variant = "outline",
    },
    ref
  ) => {
    const isOutline = variant === "outline";

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        className={cn(
          "rounded-lg px-4 py-2.5 border-2",
          selected && !isOutline
            ? "bg-orange-500 border-orange-500"
            : "bg-transparent border-border",
          selected && isOutline
            ? "bg-orange-500 border-orange-500"
            : "",
          disabled && "opacity-50"
        )}
      >
        <Text
          className={cn(
            "text-sm font-semibold text-center",
            selected ? "text-white" : "text-foreground"
          )}
        >
          {label}
        </Text>
      </Pressable>
    );
  }
);
ToggleButton.displayName = "ToggleButton";

export { ToggleButton };
