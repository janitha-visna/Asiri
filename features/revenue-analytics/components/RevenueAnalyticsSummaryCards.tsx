import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatCurrencyCompact } from "../revenue-analytics.constants";
import { summarizeRevenueAnalytics } from "../revenue-analytics.utils";
import type { RevenueAnalyticsResponse } from "../revenue-analytics.types";

function SummaryCard({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: string;
  accentClassName?: string;
}) {
  return (
    <Card className="w-[48%]">
      <CardContent className="gap-1 p-3">
        <Text className="text-xs text-muted-foreground">{label}</Text>
        <Text
          numberOfLines={2}
          className={`text-lg font-bold text-foreground ${accentClassName ?? ""}`}
        >
          {value}
        </Text>
      </CardContent>
    </Card>
  );
}

export function RevenueAnalyticsSummaryCards({
  response,
}: {
  response: RevenueAnalyticsResponse;
}) {
  const summary = summarizeRevenueAnalytics(response);

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      <SummaryCard
        label="Total Revenue"
        value={formatCurrencyCompact(summary.totalRevenue)}
        accentClassName="text-green-600"
      />
      <SummaryCard
        label="Average Monthly Revenue"
        value={formatCurrencyCompact(summary.averageMonthlyRevenue)}
      />
      <SummaryCard
        label="Highest Revenue Month"
        value={`${summary.highestMonth} • ${formatCurrencyCompact(summary.highestRevenue)}`}
        accentClassName="text-green-600"
      />
      <SummaryCard
        label="Lowest Revenue Month"
        value={`${summary.lowestMonth} • ${formatCurrencyCompact(summary.lowestRevenue)}`}
        accentClassName="text-slate-500"
      />
    </View>
  );
}
