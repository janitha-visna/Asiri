import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueAnalyticsData } from "../useRevenueAnalyticsData";
import { RevenueAnalyticsEmptyState } from "./RevenueAnalyticsEmptyState";
import { RevenueAnalyticsErrorState } from "./RevenueAnalyticsErrorState";
import { RevenueAnalyticsInsights } from "./RevenueAnalyticsInsights";
import {
  RevenueAnalyticsInsightsSkeleton,
  RevenueAnalyticsSummaryCardsSkeleton,
} from "./RevenueAnalyticsSkeleton";
import { RevenueAnalyticsSummaryCards } from "./RevenueAnalyticsSummaryCards";
import { RevenueTrendChartCard } from "./RevenueTrendChartCard";

export function RevenueAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const yearly = useRevenueAnalyticsData();
  const { status, response, year, retry } = yearly;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      {status === "loading" && <RevenueAnalyticsSummaryCardsSkeleton />}
      {status === "success" && response && (
        <RevenueAnalyticsSummaryCards response={response} />
      )}

      <RevenueTrendChartCard yearly={yearly} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Revenue Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {status === "loading" && <RevenueAnalyticsInsightsSkeleton />}
          {status === "error" && (
            <RevenueAnalyticsErrorState onRetry={retry} />
          )}
          {status === "empty" && (
            <RevenueAnalyticsEmptyState label={`${year}`} />
          )}
          {status === "success" && response && (
            <RevenueAnalyticsInsights response={response} />
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
