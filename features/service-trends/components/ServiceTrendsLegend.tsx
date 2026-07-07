import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { getServiceLineColor } from "../service-trends.constants";
import type { ServiceTypeTrend } from "../service-trends.types";

export function ServiceTrendsLegend({ data }: { data: ServiceTypeTrend[] }) {
  return (
    <View className="flex-row flex-wrap gap-x-4 gap-y-2">
      {data.map((series, index) => (
        <View key={series.serviceType} className="flex-row items-center gap-1.5">
          <View
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: getServiceLineColor(index) }}
          />
          <Text className="text-xs font-medium text-muted-foreground">
            {series.serviceType}
          </Text>
        </View>
      ))}
    </View>
  );
}
