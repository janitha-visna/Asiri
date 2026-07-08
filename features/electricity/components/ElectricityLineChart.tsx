import { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { Text } from "@/components/ui/text";
import {
  CHART_LINE_COLOR,
  Y_AXIS_SECTIONS,
  roundUpToNiceMax,
} from "../electricity.constants";
import type { ElectricityAnalyticsResponse } from "../electricity.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const POINT_SPACING = 56;
const INITIAL_SPACING = 16;
const END_SPACING = 40;

type ChartPoint = { value: number; label: string };

function PointerLabel({
  items,
  unit,
}: {
  items: ChartPoint[];
  unit: string;
}) {
  const item = items[0];
  if (!item) return null;
  return (
    <View className="min-w-[120px] items-center gap-0.5 rounded-lg bg-foreground px-3 py-2 shadow-md">
      <Text className="text-xs font-medium text-background/80">
        {item.label}
      </Text>
      <Text className="text-sm font-bold text-background">
        {item.value} {unit}
      </Text>
    </View>
  );
}

export function ElectricityLineChart({
  response,
}: {
  response: ElectricityAnalyticsResponse;
}) {
  const chartData: ChartPoint[] = useMemo(
    () =>
      response.data.map((item) => ({
        value: item.consumption,
        label: item.month,
      })),
    [response]
  );

  const maxValue = useMemo(
    () =>
      roundUpToNiceMax(
        Math.max(...response.data.map((item) => item.consumption)),
        Y_AXIS_SECTIONS
      ),
    [response]
  );

  const yAxisLabelTexts = useMemo(
    () =>
      Array.from({ length: Y_AXIS_SECTIONS + 1 }, (_, i) =>
        `${Math.round((maxValue / Y_AXIS_SECTIONS) * i)}`
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
        yAxisLabelWidth={40}
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
          pointerLabelWidth: 120,
          pointerLabelHeight: 110,
          activatePointersOnLongPress: false,
          activatePointersInstantlyOnTouch: true,
          autoAdjustPointerLabelPosition: true,
          pointerVanishDelay: 150,
          pointerLabelComponent: (items: ChartPoint[]) => (
            <PointerLabel items={items} unit={response.unit} />
          ),
        }}
      />
    </ScrollView>
  );
}
