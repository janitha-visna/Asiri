import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useElectricityAnalytics } from "../useElectricityAnalytics";
import { useRecentReadings } from "../useRecentReadings";
import { ConsumptionHistoryList } from "./ConsumptionHistoryList";
import { ElectricityEmptyState } from "./ElectricityEmptyState";
import { ElectricityErrorState } from "./ElectricityErrorState";
import { ElectricityLineChart } from "./ElectricityLineChart";
import {
  ConsumptionHistorySkeleton,
  ElectricityChartSkeleton,
  ElectricitySummaryCardsSkeleton,
} from "./ElectricitySkeleton";
import { ElectricitySummaryCards } from "./ElectricitySummaryCards";
import { MeterReadingForm } from "./MeterReadingForm";

export function ElectricityScreen() {
  const insets = useSafeAreaInsets();
  const analytics = useElectricityAnalytics();
  const recent = useRecentReadings();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      {/* Section 1 — Electricity Consumption Analytics */}
      {analytics.status === "loading" && <ElectricitySummaryCardsSkeleton />}
      {analytics.status === "success" && analytics.response && (
        <ElectricitySummaryCards response={analytics.response} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Electricity Consumption Trend
          </CardTitle>
          <Text className="text-xs text-muted-foreground">
            Monthly consumption for {new Date().getFullYear()}
          </Text>
        </CardHeader>
        <CardContent className="gap-2">
          {analytics.status === "loading" && <ElectricityChartSkeleton />}
          {analytics.status === "error" && (
            <ElectricityErrorState onRetry={analytics.retry} />
          )}
          {analytics.status === "empty" && <ElectricityEmptyState />}
          {analytics.status === "success" && analytics.response && (
            <>
              <Text className="text-[10px] text-muted-foreground">
                Consumption ({analytics.response.unit})
              </Text>
              <ElectricityLineChart response={analytics.response} />
              <Text className="text-center text-[10px] text-muted-foreground">
                Month
              </Text>
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 2 — Record Today's Meter Reading */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Record Today's Meter Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MeterReadingForm
            onSave={recent.addReading}
            isSaving={recent.isSaving}
          />
        </CardContent>
      </Card>

      {/* Section 3 — Recent Electricity Consumption */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Recent Electricity Consumption
          </CardTitle>
          <Text className="text-xs text-muted-foreground">Last 7 days</Text>
        </CardHeader>
        <CardContent>
          {recent.status === "loading" && <ConsumptionHistorySkeleton />}
          {recent.status === "error" && (
            <ElectricityErrorState
              message="Couldn't load recent readings."
              onRetry={recent.retry}
            />
          )}
          {recent.status === "empty" && (
            <ElectricityEmptyState message="No recent electricity readings recorded yet." />
          )}
          {recent.status === "success" && (
            <ConsumptionHistoryList readings={recent.readings} />
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
