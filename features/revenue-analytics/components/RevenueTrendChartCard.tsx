import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, type SelectItem } from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { ToggleButton } from "@/components/ui/toggle-button";
import { useWeeklyRevenueData } from "../useWeeklyRevenueData";
import type {
  RevenueAnalyticsState,
  RevenueGranularity,
} from "../revenue-analytics.types";
import { RevenueAnalyticsEmptyState } from "./RevenueAnalyticsEmptyState";
import { RevenueAnalyticsErrorState } from "./RevenueAnalyticsErrorState";
import { RevenueAnalyticsLineChart } from "./RevenueAnalyticsLineChart";
import { RevenueAnalyticsChartSkeleton } from "./RevenueAnalyticsSkeleton";
import { RevenueWeeklyLineChart } from "./RevenueWeeklyLineChart";

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_OPTIONS: SelectItem[] = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
].map((label, index) => ({ label, value: `${index}` }));

export function RevenueTrendChartCard({
  yearly,
}: {
  yearly: RevenueAnalyticsState;
}) {
  const [granularity, setGranularity] = useState<RevenueGranularity>("yearly");
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());

  const weekly = useWeeklyRevenueData(yearly.year, monthIndex);

  const activeStatus = granularity === "yearly" ? yearly.status : weekly.status;
  const emptyLabel =
    granularity === "yearly"
      ? `${yearly.year}`
      : `${MONTH_OPTIONS[monthIndex].label} ${yearly.year}`;
  const retry = granularity === "yearly" ? yearly.retry : weekly.retry;

  return (
    <Card>
      <CardHeader className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <CardTitle className="text-base text-foreground">
              Revenue Trend
            </CardTitle>
            <Text className="text-xs text-muted-foreground">
              {granularity === "yearly"
                ? "Monthly revenue breakdown"
                : "Weekly revenue breakdown"}
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
              onPress={() => yearly.setYear(Math.min(yearly.year + 1, CURRENT_YEAR))}
              disabled={yearly.year >= CURRENT_YEAR}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-muted disabled:opacity-30"
            >
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </Pressable>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          <ToggleButton
            label="By Year"
            selected={granularity === "yearly"}
            onPress={() => setGranularity("yearly")}
          />
          <ToggleButton
            label="By Week"
            selected={granularity === "weekly"}
            onPress={() => setGranularity("weekly")}
          />
          {granularity === "weekly" && (
            <View className="min-w-[130px] flex-1">
              <Select
                items={MONTH_OPTIONS}
                value={`${monthIndex}`}
                onValueChange={(value) => setMonthIndex(Number(value))}
                placeholder="Select month"
              />
            </View>
          )}
        </View>
      </CardHeader>
      <CardContent className="gap-2">
        {activeStatus === "loading" && <RevenueAnalyticsChartSkeleton />}
        {activeStatus === "error" && <RevenueAnalyticsErrorState onRetry={retry} />}
        {activeStatus === "empty" && (
          <RevenueAnalyticsEmptyState label={emptyLabel} />
        )}
        {activeStatus === "success" &&
          granularity === "yearly" &&
          yearly.response && (
            <>
              <Text className="text-[10px] text-muted-foreground">
                Revenue ({yearly.response.currency})
              </Text>
              <RevenueAnalyticsLineChart response={yearly.response} />
              <Text className="text-center text-[10px] text-muted-foreground">
                Month
              </Text>
            </>
          )}
        {activeStatus === "success" &&
          granularity === "weekly" &&
          weekly.response && (
            <>
              <Text className="text-[10px] text-muted-foreground">
                Revenue ({weekly.response.currency})
              </Text>
              <RevenueWeeklyLineChart response={weekly.response} />
              <Text className="text-center text-[10px] text-muted-foreground">
                Week
              </Text>
            </>
          )}
      </CardContent>
    </Card>
  );
}
