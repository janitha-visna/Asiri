import { View } from "react-native";

export function RevenueChartSkeleton() {
  return (
    <View className="gap-3">
      <View className="h-4 w-32 rounded bg-muted" />
      <View className="h-52 w-full rounded-lg bg-muted" />
      <View className="flex-row justify-between px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="h-3 w-6 rounded bg-muted" />
        ))}
      </View>
    </View>
  );
}
