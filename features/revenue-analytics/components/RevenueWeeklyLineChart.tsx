import { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { Text } from "@/components/ui/text";
import {
  CHART_LINE_COLOR,
  Y_AXIS_SECTIONS,
  formatCurrencyCompact,
  formatCurrencyFull,
  roundUpToNiceMax,
} from "../revenue-analytics.constants";
import type { WeeklyRevenueResponse } from "../revenue-analytics.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const POINT_SPACING = 70;
const INITIAL_SPACING = 16;
const END_SPACING = 40;

type ChartPoint = { value: number; label: string };

function PointerLabel({
  items,
  currency,
  month,
  year,
}: {
  items: ChartPoint[];
  currency: string;
  month: string;
  year: number;
}) {
  const item = items[0];
  if (!item) return null;
  return (
    <View className="min-w-[140px] items-center gap-0.5 rounded-lg bg-foreground px-3 py-2 shadow-md">
      <Text className="text-xs font-medium text-background/80">
        {item.label} • {month} {year}
      </Text>
      <Text className="text-sm font-bold text-background">
        {formatCurrencyFull(currency, item.value ?? 0)}
      </Text>
    </View>
  );
}

export function RevenueWeeklyLineChart({
  response,
}: {
  response: WeeklyRevenueResponse;
}) {
  const chartData: ChartPoint[] = useMemo(
    () =>
      response.revenue.map((value, index) => ({
        value,
        label: response.weeks[index],
      })),
    [response]
  );

  const maxValue = useMemo(
    () => roundUpToNiceMax(Math.max(...response.revenue), Y_AXIS_SECTIONS),
    [response]
  );

  const yAxisLabelTexts = useMemo(
    () =>
      Array.from({ length: Y_AXIS_SECTIONS + 1 }, (_, i) =>
        formatCurrencyCompact((maxValue / Y_AXIS_SECTIONS) * i)
      ),
    [maxValue]
  );

  const minChartWidth = SCREEN_WIDTH - 64;
  const chartWidth = Math.max(
    minChartWidth,
    POINT_SPACING * (chartData.length - 1) + INITIAL_SPACING + END_SPACING
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <LineChart
        data={chartData}
        curved
        areaChart
        disableScroll
        width={chartWidth}
        height={220}
        initialSpacing={INITIAL_SPACING}
        endSpacing={END_SPACING}
        spacing={POINT_SPACING}
        color={CHART_LINE_COLOR}
        thickness={3}
        startFillColor={CHART_LINE_COLOR}
        endFillColor={CHART_LINE_COLOR}
        startOpacity={0.35}
        endOpacity={0.02}
        maxValue={maxValue}
        noOfSections={Y_AXIS_SECTIONS}
        yAxisLabelTexts={yAxisLabelTexts}
        yAxisTextStyle={{ fontSize: 10, color: "#71717a" }}
        yAxisLabelWidth={56}
        yAxisColor="transparent"
        xAxisColor="#e4e4e7"
        xAxisLabelTextStyle={{ fontSize: 10, color: "#71717a" }}
        rulesColor="#e4e4e7"
        rulesType="dashed"
        dataPointsColor={CHART_LINE_COLOR}
        dataPointsRadius={4}
        isAnimated
        animationDuration={700}
        pointerConfig={{
          pointerStripHeight: 180,
          pointerStripColor: "#d4d4d8",
          pointerStripWidth: 2,
          pointerColor: CHART_LINE_COLOR,
          radius: 6,
          pointerLabelWidth: 150,
          pointerLabelHeight: 130,
          activatePointersOnLongPress: false,
          activatePointersInstantlyOnTouch: true,
          autoAdjustPointerLabelPosition: true,
          pointerVanishDelay: 150,
          pointerLabelComponent: (items: ChartPoint[]) => (
            <PointerLabel
              items={items}
              currency={response.currency}
              month={response.month}
              year={response.year}
            />
          ),
        }}
      />
    </ScrollView>
  );
}
