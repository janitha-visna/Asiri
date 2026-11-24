import { useMemo, useState } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { BarChart } from "react-native-gifted-charts";
import { useColorScheme } from "nativewind";
import { Text } from "@/components/ui/text";
import {
  NON_REPEAT_COLOR,
  REPEAT_COLOR,
  formatCompactCount,
  roundUpToNiceMax,
} from "../analytics.constants";
import type { AnalyticsResponse } from "../analytics.types";


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

  const Y_SECTIONS = 5;

  const {  yAxisLabels } = useMemo(() => {
    const maxTotal = Math.max(
      0,
      ...response.data.map((item) => item.repeatCount + item.nonRepeatCount),
    );
    const niceMax = roundUpToNiceMax(maxTotal, Y_SECTIONS);
    const labels: string[] = [];
    for (let i = 0; i <= Y_SECTIONS; i++) {
      labels.push(formatCompactCount((niceMax / Y_SECTIONS) * i));
    }
    return { maxValue: niceMax, yAxisLabels: labels };
  }, [response.data]);

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
          height={250}
          initialSpacing={10}
          endSpacing={20}
          noOfSections={Y_SECTIONS}
          yAxisLabelTexts={yAxisLabels}
          yAxisTextStyle={{ fontSize: 10, color: axisTextColor }}
          yAxisColor="transparent"
          xAxisColor={gridColor}
          xAxisThickness={1}
          rulesColor={gridColor}
          rulesType="dashed"
          isAnimated
          animationDuration={400}
          disableScroll
        />
      </ScrollView>
    </View>
  );
}
