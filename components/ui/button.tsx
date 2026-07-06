import * as React from "react";
import { Pressable, Text, type ViewProps } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps extends ViewProps {
  variant?: "default" | "secondary" | "destructive" | "ghost";
  size?: "default" | "sm" | "lg";
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      disabled = false,
      children,
      onPress,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: "bg-primary",
      secondary: "bg-secondary",
      destructive: "bg-destructive",
      ghost: "bg-transparent",
    }[variant];

    const sizeClasses = {
      default: "px-4 py-2 rounded-md",
      sm: "px-3 py-1.5 rounded-sm",
      lg: "px-6 py-3 rounded-lg",
    }[size];

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        className={cn(
          "flex items-center justify-center",
          variantClasses,
          sizeClasses,
          disabled && "opacity-50",
          className
        )}
        {...props}
      >
        {typeof children === "string" ? (
          <Text className="font-semibold text-primary-foreground">{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = "Button";

export { Button };
