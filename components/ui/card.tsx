import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<React.ElementRef<typeof View>, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn(
        "rounded-lg border border-border bg-card shadow-sm shadow-black/5",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<React.ElementRef<typeof View>, ViewProps>(
  ({ className, ...props }, ref) => (
    <View ref={ref} className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    role="heading"
    aria-level={3}
    className={cn(
      "text-sm font-medium leading-none text-muted-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<React.ElementRef<typeof View>, ViewProps>(
  ({ className, ...props }, ref) => (
    <TextClassContext.Provider value="text-base font-semibold text-card-foreground">
      <View ref={ref} className={cn("p-4 pt-0", className)} {...props} />
    </TextClassContext.Provider>
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<React.ElementRef<typeof View>, ViewProps>(
  ({ className, ...props }, ref) => (
    <View
      ref={ref}
      className={cn("flex flex-row items-center p-4 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardContent, CardFooter, CardHeader, CardTitle };
