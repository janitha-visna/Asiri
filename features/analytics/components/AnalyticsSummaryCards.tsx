import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { AnalyticsResponse } from "../analytics.types";

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
          className={`text-xl font-bold text-foreground ${accentClassName ?? ""}`}
        >
          {value}
        </Text>
      </CardContent>
    </Card>
  );
}

export function AnalyticsSummaryCards({
  response,
}: {
  response: AnalyticsResponse;
}) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      <SummaryCard label="Total Vehicles" value={`${response.totalVehicles}`} />
      <SummaryCard
        label="Repeat Vehicles"
        value={`${response.repeatVehicles}`}
        accentClassName="text-green-600"
      />
      <SummaryCard
        label="Non-Repeat Vehicles"
        value={`${response.nonRepeatVehicles}`}
        accentClassName="text-slate-500"
      />
      <SummaryCard
        label="Repeat Percentage"
        value={`${response.repeatPercentage.toFixed(1)}%`}
        accentClassName="text-green-600"
      />
    </View>
  );
}
