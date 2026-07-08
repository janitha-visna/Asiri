import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { summarizeElectricityAnalytics } from "../electricity.utils";
import type { ElectricityAnalyticsResponse } from "../electricity.types";

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

export function ElectricitySummaryCards({
  response,
}: {
  response: ElectricityAnalyticsResponse;
}) {
  const summary = summarizeElectricityAnalytics(response);

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      <SummaryCard
        label="Total Consumption"
        value={`${summary.total.toLocaleString()} ${response.unit}`}
        accentClassName="text-blue-600"
      />
      <SummaryCard
        label="Average Monthly Consumption"
        value={`${summary.averageMonthly.toLocaleString()} ${response.unit}`}
      />
      <SummaryCard
        label="Highest Consumption Month"
        value={`${summary.highestMonth} • ${summary.highestConsumption} ${response.unit}`}
        accentClassName="text-red-600"
      />
      <SummaryCard
        label="Lowest Consumption Month"
        value={`${summary.lowestMonth} • ${summary.lowestConsumption} ${response.unit}`}
        accentClassName="text-green-600"
      />
    </View>
  );
}
