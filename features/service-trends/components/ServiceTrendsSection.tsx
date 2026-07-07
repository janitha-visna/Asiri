import { View } from "react-native";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useServiceTrendsData } from "../useServiceTrendsData";
import { ServiceTrendsEmptyState } from "./ServiceTrendsEmptyState";
import { ServiceTrendsErrorState } from "./ServiceTrendsErrorState";
import { ServiceTrendsLegend } from "./ServiceTrendsLegend";
import { ServiceTrendsMultiLineChart } from "./ServiceTrendsMultiLineChart";
import {
  ServiceTrendsChartSkeleton,
  ServiceTrendsSummaryCardsSkeleton,
} from "./ServiceTrendsSkeleton";
import { ServiceTrendsSummaryCards } from "./ServiceTrendsSummaryCards";

const CURRENT_YEAR = new Date().getFullYear();

export function ServiceTrendsSection() {
  const { status, response, retry } = useServiceTrendsData(CURRENT_YEAR);

  return (
    <View className="gap-4">
      {status === "loading" && <ServiceTrendsSummaryCardsSkeleton />}
      {status === "success" && response && (
        <ServiceTrendsSummaryCards response={response} />
      )}

      <Card>
        <CardHeader className="gap-2">
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">
              Service Demand Trends
            </Text>
            <Text className="text-xs text-muted-foreground">
              Monthly service volume for {CURRENT_YEAR}
            </Text>
          </View>
          {status === "success" && response && (
            <ServiceTrendsLegend data={response.data} />
          )}
        </CardHeader>
        <CardContent className="gap-2">
          {status === "loading" && <ServiceTrendsChartSkeleton />}
          {status === "error" && <ServiceTrendsErrorState onRetry={retry} />}
          {status === "empty" && (
            <ServiceTrendsEmptyState year={CURRENT_YEAR} />
          )}
          {status === "success" && response && (
            <>
              <Text className="text-[10px] text-muted-foreground">
                Number of Services
              </Text>
              <ServiceTrendsMultiLineChart response={response} />
              <Text className="text-center text-[10px] text-muted-foreground">
                Month
              </Text>
            </>
          )}
        </CardContent>
      </Card>
    </View>
  );
}
