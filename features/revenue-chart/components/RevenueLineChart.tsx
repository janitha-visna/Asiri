import { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { formatCurrencyCompact } from "../revenue-chart.constants";
import type { MonthlyRevenuePoint } from "../revenue-chart.types";

const CHART_LINE_COLOR = "#16a34a";

type ChartDataItem = { value: number; label: string };

export function RevenueLineChart({ data }: { data: MonthlyRevenuePoint[] }) {
  const chartData: ChartDataItem[] = useMemo(
    () =>
      data.map((point) => ({
        value: point.value ?? 0,
        label: point.month,
      })),
    [data],
  );

  console.log("chartData:", chartData);

  const Y_SECTIONS = 6;

  const { yAxisMax, yAxisLabels } = useMemo(() => {
    const maxRevenue = Math.max(0, ...data.map((point) => point.value ?? 0));
    const step = Math.max(
      50_000,
      Math.ceil(maxRevenue / Y_SECTIONS / 50_000) * 50_000,
    );
    const labels: string[] = [];
    for (let i = 0; i <= Y_SECTIONS; i++) {
      labels.push(formatCurrencyCompact(i * step));
    }
    return { yAxisMax: step * Y_SECTIONS, yAxisLabels: labels };
  }, [data]);

  const POINT_SPACING = 50;
  const INITIAL_SPACING = 10;
  const END_SPACING = 20;

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
        disableScroll={false}
        textShiftY={-8}
        initialSpacing={INITIAL_SPACING}
        endSpacing={END_SPACING}
        spacing={POINT_SPACING}
        color={CHART_LINE_COLOR}
        startFillColor={CHART_LINE_COLOR}
        endFillColor={CHART_LINE_COLOR}
        startOpacity={0.8}
        endOpacity={0.02}
        maxValue={yAxisMax}
        noOfSections={Y_SECTIONS}
        yAxisLabelTexts={yAxisLabels}
        yAxisTextStyle={{ fontSize: 10, color: "#71717a" }}
        yAxisLabelWidth={56}
        yAxisColor="transparent"
        xAxisColor="#e4e4e7"
        xAxisLabelTextStyle={{ fontSize: 10, color: "#71717a" }}
        rulesColor="#e4e4e7"
        dataPointsColor={CHART_LINE_COLOR}
        dataPointsRadius={5}
        isAnimated={true}
        animationDuration={700}
      />
    </ScrollView>
  );
}
