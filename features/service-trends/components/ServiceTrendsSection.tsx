import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [year, setYear] = useState(CURRENT_YEAR);
  const { status, response, retry } = useServiceTrendsData(year);

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    if (year < CURRENT_YEAR) {
      setYear(year + 1);
    }
  };

  return (
    <View className="gap-4">
      {status === "loading" && <ServiceTrendsSummaryCardsSkeleton />}
      {status === "success" && response && (
        <ServiceTrendsSummaryCards response={response} />
      )}

      <Card>
        <CardHeader className="gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground">
                Service Demand Trends
              </Text>
              <Text className="text-xs text-muted-foreground">
                Monthly service volume for {year}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={handlePreviousYear}
                hitSlop={8}
                className="h-7 w-7 items-center justify-center rounded-full bg-muted"
              >
                <Ionicons name="chevron-back" size={16} color="#71717a" />
              </Pressable>
              <Text className="min-w-[40px] text-center text-sm font-semibold text-foreground">
                {year}
              </Text>
              <Pressable
                onPress={handleNextYear}
                disabled={year >= CURRENT_YEAR}
                hitSlop={8}
                className="h-7 w-7 items-center justify-center rounded-full bg-muted disabled:opacity-30"
              >
                <Ionicons name="chevron-forward" size={16} color="#71717a" />
              </Pressable>
            </View>
          </View>
          {status === "success" && response && (
            <ServiceTrendsLegend data={response.data} />
          )}
        </CardHeader>
        <CardContent className="gap-2">
          {status === "loading" && <ServiceTrendsChartSkeleton />}
          {status === "error" && <ServiceTrendsErrorState onRetry={retry} />}
          {status === "empty" && <ServiceTrendsEmptyState year={year} />}
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
