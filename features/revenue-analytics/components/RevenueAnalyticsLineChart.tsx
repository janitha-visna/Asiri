import { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import {
  CHART_LINE_COLOR,
  formatCurrencyCompact,
  roundUpToNiceMax,
} from "../revenue-analytics.constants";
import type { RevenueAnalyticsResponse } from "../revenue-analytics.types";

type ChartPoint = { value: number; label: string };

export function RevenueAnalyticsLineChart({
  response,
}: {
  response: RevenueAnalyticsResponse;
}) {
  const chartData: ChartPoint[] = useMemo(
    () =>
      response.revenue.map((value, index) => ({
        value,
        label: response.months[index],
      })),
    [response],
  );

  const Y_SECTIONS = 5;

  const { maxValue, yAxisLabelTexts } = useMemo(() => {
    const maxRevenue = Math.max(0, ...response.revenue);
    const niceMax = roundUpToNiceMax(maxRevenue, Y_SECTIONS);
    const labels: string[] = [];
    for (let i = 0; i <= Y_SECTIONS; i++) {
      labels.push(formatCurrencyCompact((niceMax / Y_SECTIONS) * i));
    }
    return { maxValue: niceMax, yAxisLabelTexts: labels };
  }, [response.revenue]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <LineChart
        data={chartData}
        showValuesAsDataPointsText={true}
        areaChart
        disableScroll
        color={CHART_LINE_COLOR}
        textShiftY={-10}
        startFillColor={CHART_LINE_COLOR}
        endFillColor={CHART_LINE_COLOR}
        startOpacity={0.35}
        endOpacity={0.02}
        maxValue={maxValue}
        noOfSections={Y_SECTIONS}
        yAxisLabelTexts={yAxisLabelTexts}
        yAxisTextStyle={{ fontSize: 10, color: "#71717a" }}
        yAxisLabelWidth={56}
        yAxisColor="transparent"
        xAxisColor="#e4e4e7"
        xAxisLabelTextStyle={{ fontSize: 10, color: "#71717a" }}
        dataPointsColor={CHART_LINE_COLOR}
        isAnimated
        animationDuration={400}
      />
    </ScrollView>
  );
}
