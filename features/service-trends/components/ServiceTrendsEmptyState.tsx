import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function ServiceTrendsEmptyState({ year }: { year: number }) {
  return (
    <View className="h-52 items-center justify-center gap-1 rounded-lg bg-muted/40">
      <Text className="text-sm font-medium text-muted-foreground">
        No service demand data is available for {year}.
      </Text>
      <Text className="text-xs text-muted-foreground">
        Data will appear here once services are recorded.
      </Text>
    </View>
  );
}
