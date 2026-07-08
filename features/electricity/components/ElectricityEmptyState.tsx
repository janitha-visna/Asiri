import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function ElectricityEmptyState({
  message = "No electricity consumption data is available.",
}: {
  message?: string;
}) {
  return (
    <View className="h-40 items-center justify-center gap-1 rounded-lg bg-muted/40 px-4">
      <Text className="text-center text-sm font-medium text-muted-foreground">
        {message}
      </Text>
    </View>
  );
}
