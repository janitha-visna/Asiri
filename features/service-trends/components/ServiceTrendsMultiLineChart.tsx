import { useMemo } from "react";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import { Text } from "@/components/ui/text";
import {
  Y_AXIS_SECTIONS,
  formatCompactCount,
  getServiceLineColor,
  roundUpToNiceMax,
} from "../service-trends.constants";
import type { ServiceTrendsResponse } from "../service-trends.types";

const SCREEN_WIDTH = Dimensions.get("window").width;

const POINT_SPACING = 44;
const INITIAL_SPACING = 16;
const END_SPACING = 40;

type ChartPoint = { value: number; label?: string };

function PointerLabel({
  items,
  serviceTypes,
}: {
  items: ChartPoint[];
  serviceTypes: string[];
}) {
  const month = items[0]?.label;
  if (!month) return null;

  return (
    <View className="min-w-[140px] gap-1 rounded-lg bg-foreground px-3 py-2 shadow-md">
      <Text className="text-xs font-semibold text-background/80">{month}</Text>
      {items.map((item, index) => (
        <View key={serviceTypes[index]} className="flex-row items-center gap-1.5">
          <View
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: getServiceLineColor(index) }}
          />
          <Text className="flex-1 text-[11px] text-background/90" numberOfLines={1}>
            {serviceTypes[index]}
          </Text>
          <Text className="text-[11px] font-bold text-background">
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ServiceTrendsMultiLineChart({
  response,
}: {
  response: ServiceTrendsResponse;
}) {
  const serviceTypes = useMemo(
    () => response.data.map((series) => series.serviceType),
    [response]
  );

  const maxValue = useMemo(() => {
    const maxDataValue = Math.max(
      ...response.data.flatMap((series) => series.values)
    );
    return roundUpToNiceMax(maxDataValue, Y_AXIS_SECTIONS);
  }, [response]);

  const dataSet = useMemo(
    () =>
      response.data.map((series, index) => ({
        data: series.values.map((value, monthIndex) => ({
          value,
          label: response.months[monthIndex],
        })),
        color: getServiceLineColor(index),
        dataPointsColor: getServiceLineColor(index),
        thickness: 2.5,
      })),
    [response]
  );

  const monthCount = response.months.length;
  const minChartWidth = SCREEN_WIDTH - 64;
  const chartWidth = Math.max(
    minChartWidth,
    POINT_SPACING * (monthCount - 1) + INITIAL_SPACING + END_SPACING
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <LineChart
        dataSet={dataSet}
        curved
        disableScroll
        width={chartWidth}
        height={220}
        initialSpacing={INITIAL_SPACING}
        endSpacing={END_SPACING}
        spacing={POINT_SPACING}
        maxValue={maxValue}
        noOfSections={Y_AXIS_SECTIONS}
        yAxisLabelTexts={Array.from({ length: Y_AXIS_SECTIONS + 1 }, (_, i) =>
          formatCompactCount((maxValue / Y_AXIS_SECTIONS) * i)
        )}
        yAxisTextStyle={{ fontSize: 10, color: "#71717a" }}
        yAxisLabelWidth={40}
        yAxisColor="transparent"
        xAxisColor="#e4e4e7"
        xAxisLabelTextStyle={{ fontSize: 10, color: "#71717a" }}
        rulesColor="#e4e4e7"
        rulesType="dashed"
        dataPointsRadius={3}
        isAnimated
        animationDuration={700}
        pointerConfig={{
          pointerStripHeight: 190,
          pointerStripColor: "#d4d4d8",
          pointerStripWidth: 2,
          radius: 5,
          pointerLabelWidth: 150,
          pointerLabelHeight: 120,
          activatePointersOnLongPress: false,
          activatePointersInstantlyOnTouch: true,
          autoAdjustPointerLabelPosition: true,
          pointerVanishDelay: 150,
          pointerLabelComponent: (items: ChartPoint[]) => (
            <PointerLabel items={items} serviceTypes={serviceTypes} />
          ),
        }}
      />
    </ScrollView>
  );
}
