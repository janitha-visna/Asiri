import { Text } from "@/components/ui/text";
import { Dimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import {
  Y_AXIS_LABELS,
  Y_AXIS_MAX,
  Y_AXIS_SECTIONS,
  formatCurrencyFull,
} from "../revenue-chart.constants";
import type { MonthlyRevenuePoint } from "../revenue-chart.types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_LINE_COLOR = "#16a34a";

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
  const chartData: ChartDataItem[] = data.map((point) => ({
    value: point.value ?? 0,
    label: point.month,
  }));

  const POINT_SPACING = 56;
  const INITIAL_SPACING = 16;
  const END_SPACING = 40;
  const minChartWidth = SCREEN_WIDTH - 64;
  const chartWidth = Math.max(
    minChartWidth,
    POINT_SPACING * (chartData.length - 1) + INITIAL_SPACING + END_SPACING,
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
        maxValue={Y_AXIS_MAX}
        noOfSections={Y_AXIS_SECTIONS}
        yAxisLabelTexts={Y_AXIS_LABELS}
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
          pointerLabelWidth: 120,
          // Larger than the tooltip's real height on purpose — when
          // autoAdjustPointerLabelPosition is true, this value (not
          // shiftPointerLabelY) drives the "-pointerLabelHeight" vertical
          // offset used to place the tooltip above the touch point.
          pointerLabelHeight: 130,
          activatePointersOnLongPress: false,
          activatePointersInstantlyOnTouch: true,
          autoAdjustPointerLabelPosition: true,
          pointerVanishDelay: 150,
          pointerLabelComponent: (items: ChartDataItem[]) => (
            <PointerLabel items={items} />
          ),
        }}
      />
    </ScrollView>
  );
}
