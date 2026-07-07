import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { formatCurrencyFull } from "../revenue-analytics.constants";
import { summarizeRevenueAnalytics } from "../revenue-analytics.utils";
import type { RevenueAnalyticsResponse } from "../revenue-analytics.types";

const TREND_STYLES = {
  Increasing: { icon: "▲", className: "text-green-600" },
  Decreasing: { icon: "▼", className: "text-red-600" },
  Stable: { icon: "■", className: "text-slate-500" },
} as const;

function InsightRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text
        className={`text-sm font-semibold text-foreground ${valueClassName ?? ""}`}
      >
        {value}
      </Text>
    </View>
  );
}

export function RevenueAnalyticsInsights({
  response,
}: {
  response: RevenueAnalyticsResponse;
}) {
  const summary = summarizeRevenueAnalytics(response);
  const trendStyle = TREND_STYLES[summary.trend];

  return (
    <View className="gap-2.5">
      <InsightRow
        label="Total Annual Revenue"
        value={formatCurrencyFull(response.currency, summary.totalRevenue)}
      />
      <InsightRow
        label="Highest Revenue Month"
        value={`${summary.highestMonth} (${formatCurrencyFull(response.currency, summary.highestRevenue)})`}
        valueClassName="text-green-600"
      />
      <InsightRow
        label="Lowest Revenue Month"
        value={`${summary.lowestMonth} (${formatCurrencyFull(response.currency, summary.lowestRevenue)})`}
        valueClassName="text-slate-500"
      />
      <InsightRow
        label="Average Monthly Revenue"
        value={formatCurrencyFull(response.currency, summary.averageMonthlyRevenue)}
      />
      <InsightRow
        label="Overall Trend"
        value={`${trendStyle.icon} ${summary.trend}`}
        valueClassName={trendStyle.className}
      />
    </View>
  );
}
