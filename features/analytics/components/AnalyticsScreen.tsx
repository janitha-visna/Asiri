import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useAnalyticsData } from "../useAnalyticsData";
import {
  AnalyticsChartSkeleton,
  AnalyticsSummaryCardsSkeleton,
} from "./AnalyticsSkeleton";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";
import { AnalyticsErrorState } from "./AnalyticsErrorState";
import { AnalyticsSummaryCards } from "./AnalyticsSummaryCards";
import { RepeatVehicleLegend } from "./RepeatVehicleLegend";
import { RepeatVehicleStackedBarChart } from "./RepeatVehicleStackedBarChart";
import { ServiceTrendsSection } from "@/features/service-trends/components/ServiceTrendsSection";

const CURRENT_YEAR = new Date().getFullYear();

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const [year, setYear] = useState(CURRENT_YEAR);
  const { status, response, retry } = useAnalyticsData(year);

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    if (year < CURRENT_YEAR) {
      setYear(year + 1);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      {status === "loading" && <AnalyticsSummaryCardsSkeleton />}
      {status === "success" && response && (
        <AnalyticsSummaryCards response={response} />
      )}

      <Card>
        <CardHeader className="gap-2">
          <View className="flex-row items-start justify-between gap-2">
            <View className="flex-1 gap-1">
              <Text className="text-base font-semibold text-foreground">
                Repeat vs Non-Repeat Vehicles
              </Text>
              <Text className="text-xs text-muted-foreground">
                By vehicle type ({year})
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
          {status === "success" && <RepeatVehicleLegend />}
        </CardHeader>
        <CardContent className="gap-2">
          {status === "loading" && <AnalyticsChartSkeleton />}
          {status === "error" && <AnalyticsErrorState onRetry={retry} />}
          {status === "empty" && <AnalyticsEmptyState />}
          {status === "success" && response && (
            <>
              <Text className="text-[10px] text-muted-foreground">
                Number of Vehicles
              </Text>
              <RepeatVehicleStackedBarChart response={response} />
              <Text className="text-center text-[10px] text-muted-foreground">
                Vehicle Type
              </Text>
            </>
          )}
        </CardContent>
      </Card>

      <ServiceTrendsSection />
    </ScrollView>
  );
}
