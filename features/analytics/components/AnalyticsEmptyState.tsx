import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function AnalyticsEmptyState() {
  return (
    <View className="h-52 items-center justify-center gap-1 rounded-lg bg-muted/40">
      <Text className="text-sm font-medium text-muted-foreground">
        No repeat vehicle analytics available.
      </Text>
      <Text className="text-xs text-muted-foreground">
        Data will appear here once vehicle visits are recorded.
      </Text>
    </View>
  );
}
