import { Text } from "@/components/ui/text";
import { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import {
  formatCurrencyCompact,
  formatCurrencyFull,
} from "../revenue-chart.constants";
import type { MonthlyRevenuePoint } from "../revenue-chart.types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_LINE_COLOR = "#2563eb";
const CHART_LINE_COLOR1 = "#2563eb";

type ChartDataItem = { value: number; label: string };

function PointerLabel({ items }: { items: ChartDataItem[] }) {
  const item = items[0];
  if (!item) return null;
  return (
    <View className="min-w-[110px] items-center rounded-lg bg-foreground px-3 py-2 shadow-md">
      <Text className="text-xs font-medium text-background/80">
        {item.label}
      </Text>
      <Text className="text-sm font-bold text-background">
        {formatCurrencyFull(item.value ?? 0)}
      </Text>
    </View>
  );
}

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

  const Y_SECTIONS = 5;

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
  const minChartWidth = SCREEN_WIDTH - 64;

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
        // color={CHART_LINE_COLOR}
        // startFillColor={CHART_LINE_COLOR}
        // endFillColor={CHART_LINE_COLOR1}
        startOpacity={0.8}
        endOpacity={0.02}
        //maxValue={Y_AXIS_MAX}
        //noOfSections={Y_AXIS_SECTIONS}
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
