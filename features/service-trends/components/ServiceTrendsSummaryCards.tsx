import { View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { summarizeServiceTrends } from "../service-trends.utils";
import type { ServiceTrendsResponse } from "../service-trends.types";

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

export function ServiceTrendsSummaryCards({
  response,
}: {
  response: ServiceTrendsResponse;
}) {
  const summary = summarizeServiceTrends(response);

  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      <SummaryCard
        label="Total Services Performed"
        value={`${summary.totalServices}`}
      />
      <SummaryCard
        label="Most Requested Service"
        value={summary.mostRequestedService}
        accentClassName="text-green-600"
      />
      <SummaryCard
        label="Least Requested Service"
        value={summary.leastRequestedService}
        accentClassName="text-slate-500"
      />
      <SummaryCard
        label="Service Categories"
        value={`${summary.categoryCount}`}
      />
    </View>
  );
}
