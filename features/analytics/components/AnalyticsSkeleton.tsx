import { View } from "react-native";

export function AnalyticsSummaryCardsSkeleton() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} className="h-20 w-[48%] rounded-lg bg-muted" />
      ))}
    </View>
  );
}

export function AnalyticsChartSkeleton() {
  return (
    <View className="gap-3">
      <View className="h-4 w-40 rounded bg-muted" />
      <View className="h-52 w-full rounded-lg bg-muted" />
      <View className="flex-row justify-between px-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <View key={i} className="h-3 w-12 rounded bg-muted" />
        ))}
      </View>
    </View>
  );
}
