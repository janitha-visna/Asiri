import { Text } from "@/components/ui/text";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import {
  CURRENT_MONTH_COLOR,
  PREVIOUS_MONTH_COLOR,
  Y_AXIS_MAX,
  Y_AXIS_SECTIONS,
  formatCompact,
  formatCurrencyFull,
} from "../bill-comparison.constants";
import type {
  BillComparisonResponse,
  SelectedBar,
} from "../bill-comparison.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BAR_WIDTH = 20;
const SPACING_WITHIN_GROUP = 4;
const SPACING_BETWEEN_GROUPS = 28;

export function BillComparisonBarChart({
  response,
}: {
  response: BillComparisonResponse;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState<SelectedBar | null>(null);

  const gridColor = isDark ? "#3f3f46" : "#e4e4e7";
  const axisTextColor = isDark ? "#a1a1aa" : "#71717a";

  const chartData = useMemo(() => {
    return response.data.flatMap((item) => [
      {
        value: item.previousMonthAverage,
        frontColor: PREVIOUS_MONTH_COLOR,
        spacing: SPACING_WITHIN_GROUP,
        label: item.vehicleType,
        labelTextStyle: { color: axisTextColor, fontSize: 11 },
        topLabelComponent: () => (
          <Text className="mb-1 text-[9px] font-medium text-muted-foreground">
            {formatCompact(item.previousMonthAverage)}
          </Text>
        ),
        onPress: () =>
          setSelected({
            vehicleType: item.vehicleType,
            period: "previous",
            value: item.previousMonthAverage,
          }),
      },
      {
        value: item.currentMonthAverage,
        frontColor: CURRENT_MONTH_COLOR,
        spacing: SPACING_BETWEEN_GROUPS,
        topLabelComponent: () => (
          <Text className="mb-1 text-[9px] font-medium text-muted-foreground">
            {formatCompact(item.currentMonthAverage)}
          </Text>
        ),
        onPress: () =>
          setSelected({
            vehicleType: item.vehicleType,
            period: "current",
            value: item.currentMonthAverage,
          }),
      },
    ]);
  }, [response, axisTextColor]);

  const groupWidth =
    BAR_WIDTH * 2 + SPACING_WITHIN_GROUP + SPACING_BETWEEN_GROUPS;
  const minChartWidth = SCREEN_WIDTH - 64;
  const chartWidth = Math.max(minChartWidth, groupWidth * response.data.length);

  const selectedLabel =
    selected &&
    `${selected.vehicleType} • ${
      selected.period === "previous"
        ? response.previousMonth
        : response.currentMonth
    }: ${formatCurrencyFull(response.currency, selected.value)}`;

  return (
    <View className="gap-3">
      <View className="h-6 flex-row items-center">
        {selectedLabel ? (
          <Text
            numberOfLines={1}
            className="text-sm font-semibold text-foreground"
          >
            {selectedLabel}
          </Text>
        ) : (
          <Text numberOfLines={1} className="text-xs text-muted-foreground">
            Tap a bar to see the exact average bill.
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <BarChart
          data={chartData}
          width={chartWidth}
          height={200}
          barWidth={BAR_WIDTH}
          barBorderRadius={6}
          initialSpacing={16}
          endSpacing={16}
          maxValue={Y_AXIS_MAX}
          noOfSections={Y_AXIS_SECTIONS}
          yAxisLabelTexts={Array.from({ length: Y_AXIS_SECTIONS + 1 }, (_, i) =>
            formatCompact((Y_AXIS_MAX / Y_AXIS_SECTIONS) * i),
          )}
          yAxisTextStyle={{ fontSize: 10, color: axisTextColor }}
          yAxisLabelWidth={44}
          yAxisColor="transparent"
          xAxisColor={gridColor}
          xAxisThickness={1}
          rulesColor={gridColor}
          rulesType="dashed"
          isAnimated
          animationDuration={700}
          disableScroll
        />
      </ScrollView>
    </View>
  );
}
