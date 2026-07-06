import * as React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { cn } from "@/lib/utils";

export interface SelectItem {
  label: string;
  value: string;
}

interface SelectProps {
  items: SelectItem[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const Select = React.forwardRef<View, SelectProps>(
  (
    {
      items,
      value,
      onValueChange,
      placeholder = "Select an option",
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectedItem = items.find((item) => item.value === value);

    return (
      <>
        <Pressable
          ref={ref}
          onPress={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          className={cn(
            "rounded-md border border-input bg-background px-3 py-2",
            disabled && "opacity-50"
          )}
        >
          <Text className="text-base text-foreground">
            {selectedItem?.label || placeholder}
          </Text>
        </Pressable>

        <Modal
          visible={isOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            className="flex-1 items-center justify-center bg-black/50"
            onPress={() => setIsOpen(false)}
          >
            <Pressable
              className="w-11/12 max-w-sm rounded-lg bg-card p-4"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="mb-4 text-lg font-semibold text-foreground">
                Select Option
              </Text>
              <ScrollView className="max-h-64">
                {items.map((item) => (
                  <Pressable
                    key={item.value}
                    onPress={() => {
                      onValueChange(item.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "rounded-md px-3 py-2.5",
                      value === item.value ? "bg-primary" : "bg-background"
                    )}
                  >
                    <Text
                      className={cn(
                        "text-base",
                        value === item.value
                          ? "font-semibold text-primary-foreground"
                          : "text-foreground"
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }
);
Select.displayName = "Select";

export { Select };
