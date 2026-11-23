import { Text } from "@/components/ui/text";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import {  View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import {
  CURRENT_MONTH_COLOR,
  PREVIOUS_MONTH_COLOR,
  Y_AXIS_SECTIONS,
  formatCompact,
  formatCurrencyFull,
} from "../bill-comparison.constants";
import type {
  BillComparisonResponse,
  SelectedBar,
} from "../bill-comparison.types";




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

  const { yAxisMax, yAxisLabels } = useMemo(() => {
    const maxAvg = Math.max(
      0,
      ...response.data.flatMap((item) => [
        item.previousMonthAverage,
        item.currentMonthAverage,
      ]),
    );
    const step = Math.max(
      1_000,
      Math.ceil(maxAvg / Y_AXIS_SECTIONS / 1_000) * 1_000,
    );
    const labels: string[] = [];
    for (let i = 0; i <= Y_AXIS_SECTIONS; i++) {
      labels.push(formatCompact(i * step));
    }
    return { yAxisMax: step * Y_AXIS_SECTIONS, yAxisLabels: labels };
  }, [response.data]);

 
  
  

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
          barBorderRadius={10}
          initialSpacing={16}
          endSpacing={20}
          maxValue={yAxisMax}
          noOfSections={Y_AXIS_SECTIONS}
          yAxisLabelTexts={yAxisLabels}
          yAxisTextStyle={{ fontSize: 10, color: axisTextColor }}
          yAxisLabelWidth={44}
          yAxisColor="transparent"
          xAxisColor="#e4e4e7"
          rulesColor={gridColor}
          isAnimated={true}
          animationDuration={700}
          disableScroll
        />
      </ScrollView>
    </View>
  );
}
