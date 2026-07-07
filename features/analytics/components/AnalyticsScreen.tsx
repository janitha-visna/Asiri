import { ScrollView, View } from "react-native";
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

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const { status, response, retry } = useAnalyticsData();

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
          <View className="gap-1">
            <Text className="text-base font-semibold text-foreground">
              Repeat vs Non-Repeat Vehicles
            </Text>
            <Text className="text-xs text-muted-foreground">
              By vehicle type
            </Text>
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
    </ScrollView>
  );
}
