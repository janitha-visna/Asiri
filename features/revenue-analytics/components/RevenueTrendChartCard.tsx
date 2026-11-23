import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { RevenueAnalyticsState } from "../revenue-analytics.types";
import { RevenueAnalyticsEmptyState } from "./RevenueAnalyticsEmptyState";
import { RevenueAnalyticsErrorState } from "./RevenueAnalyticsErrorState";
import { RevenueAnalyticsLineChart } from "./RevenueAnalyticsLineChart";
import { RevenueAnalyticsChartSkeleton } from "./RevenueAnalyticsSkeleton";

const CURRENT_YEAR = new Date().getFullYear();

export function RevenueTrendChartCard({
  yearly,
}: {
  yearly: RevenueAnalyticsState;
}) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <CardTitle className="text-base text-foreground">
              Revenue Trend
            </CardTitle>
            <Text className="text-xs text-muted-foreground">
              Monthly revenue breakdown
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => yearly.setYear(yearly.year - 1)}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-muted"
            >
              <Ionicons name="chevron-back" size={16} color="#71717a" />
            </Pressable>
            <Text className="min-w-[40px] text-center text-sm font-semibold text-foreground">
              {yearly.year}
            </Text>
            <Pressable
              onPress={() =>
                yearly.setYear(Math.min(yearly.year + 1, CURRENT_YEAR))
              }
              disabled={yearly.year >= CURRENT_YEAR}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-muted disabled:opacity-30"
            >
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </Pressable>
          </View>
        </View>
      </CardHeader>

      <CardContent>
        {yearly.status === "loading" && <RevenueAnalyticsChartSkeleton />}
        {yearly.status === "error" && (
          <RevenueAnalyticsErrorState onRetry={yearly.retry} />
        )}
        {yearly.status === "empty" && (
          <RevenueAnalyticsEmptyState label={`${yearly.year}`} />
        )}
        {yearly.status === "success" && yearly.response && (
          <RevenueAnalyticsLineChart response={yearly.response} />
        )}
      </CardContent>
    </Card>
  );
}
