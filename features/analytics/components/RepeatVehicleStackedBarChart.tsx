import { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "nativewind";
import { Text } from "@/components/ui/text";
import {
  NON_REPEAT_COLOR,
  REPEAT_COLOR,
  Y_AXIS_SECTIONS,
  formatCompactCount,
  roundUpToNiceMax,
} from "../analytics.constants";
import type { AnalyticsResponse } from "../analytics.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const BAR_WIDTH = 34;
const BAR_SPACING = 32;

type SelectedSegment = {
  vehicleType: string;
  category: "Repeat" | "Non-Repeat";
  value: number;
};

export function RepeatVehicleStackedBarChart({
  response,
}: {
  response: AnalyticsResponse;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState<SelectedSegment | null>(null);

  const gridColor = isDark ? "#3f3f46" : "#e4e4e7";
  const axisTextColor = isDark ? "#a1a1aa" : "#71717a";

  const maxTotal = Math.max(
    ...response.data.map((item) => item.repeatCount + item.nonRepeatCount)
  );
  const maxValue = roundUpToNiceMax(maxTotal, Y_AXIS_SECTIONS);

  const stackData = useMemo(
    () =>
      response.data.map((item) => ({
        label: item.vehicleType,
        labelTextStyle: { color: axisTextColor, fontSize: 11 },
        stacks: [
          {
            value: item.repeatCount,
            color: REPEAT_COLOR,
            onPress: () =>
              setSelected({
                vehicleType: item.vehicleType,
                category: "Repeat",
                value: item.repeatCount,
              }),
          },
          {
            value: item.nonRepeatCount,
            color: NON_REPEAT_COLOR,
            onPress: () =>
              setSelected({
                vehicleType: item.vehicleType,
                category: "Non-Repeat",
                value: item.nonRepeatCount,
              }),
          },
        ],
        topLabelComponent: () => (
          <Text className="mb-1 text-[9px] font-medium text-muted-foreground">
            {formatCompactCount(item.repeatCount + item.nonRepeatCount)}
          </Text>
        ),
      })),
    [response, axisTextColor]
  );

  const groupWidth = BAR_WIDTH + BAR_SPACING;
  const minChartWidth = SCREEN_WIDTH - 64;
  const chartWidth = Math.max(minChartWidth, groupWidth * response.data.length);

  const selectedLabel =
    selected &&
    `${selected.vehicleType} • ${selected.category}: ${selected.value}`;

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
            Tap a segment to see the exact vehicle count.
          </Text>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        <BarChart
          stackData={stackData}
          width={chartWidth}
          height={200}
          barWidth={BAR_WIDTH}
          spacing={BAR_SPACING}
          initialSpacing={20}
          endSpacing={20}
          stackBorderTopLeftRadius={6}
          stackBorderTopRightRadius={6}
          maxValue={maxValue}
          noOfSections={Y_AXIS_SECTIONS}
          yAxisLabelTexts={Array.from({ length: Y_AXIS_SECTIONS + 1 }, (_, i) =>
            formatCompactCount((maxValue / Y_AXIS_SECTIONS) * i)
          )}
          yAxisTextStyle={{ fontSize: 10, color: axisTextColor }}
          yAxisLabelWidth={36}
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
