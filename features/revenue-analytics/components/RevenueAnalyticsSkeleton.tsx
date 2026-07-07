import { View } from "react-native";

export function RevenueAnalyticsSummaryCardsSkeleton() {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} className="h-20 w-[48%] rounded-lg bg-muted" />
      ))}
    </View>
  );
}

export function RevenueAnalyticsChartSkeleton() {
  return (
    <View className="gap-3">
      <View className="h-4 w-40 rounded bg-muted" />
      <View className="h-52 w-full rounded-lg bg-muted" />
      <View className="flex-row justify-between px-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} className="h-3 w-6 rounded bg-muted" />
        ))}
      </View>
    </View>
  );
}

export function RevenueAnalyticsInsightsSkeleton() {
  return (
    <View className="gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <View key={i} className="h-4 w-full rounded bg-muted" />
      ))}
    </View>
  );
}
