import { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LineChart } from "react-native-gifted-charts";
import {
  formatCompactCount,
  getServiceLineColor,
  roundUpToNiceMax,
} from "../service-trends.constants";
import type { ServiceTrendsResponse } from "../service-trends.types";

const INITIAL_SPACING = 16;
const END_SPACING = 16;

export function ServiceTrendsMultiLineChart({
  response,
}: {
  response: ServiceTrendsResponse;
}) {
  const Y_SECTIONS = 5;

  const { yAxisLabels } = useMemo(() => {
    const maxDataValue = Math.max(
      0,
      ...response.data.flatMap((series) => series.values),
    );
    const niceMax = roundUpToNiceMax(maxDataValue, Y_SECTIONS);
    const labels: string[] = [];
    for (let i = 0; i <= Y_SECTIONS; i++) {
      labels.push(formatCompactCount((niceMax / Y_SECTIONS) * i));
    }
    return { maxValue: niceMax, yAxisLabels: labels };
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
    [response],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <LineChart
        dataSet={dataSet}
        disableScroll
        initialSpacing={INITIAL_SPACING}
        endSpacing={END_SPACING}
        noOfSections={Y_SECTIONS}
        yAxisLabelTexts={yAxisLabels}
        yAxisTextStyle={{ fontSize: 10, color: "#71717a" }}
        yAxisLabelWidth={40}
        yAxisColor="transparent"
        xAxisColor="#e4e4e7"
        xAxisLabelTextStyle={{ fontSize: 10, color: "#71717a" }}
        rulesColor="#e4e4e7"
        rulesType="dashed"
        isAnimated
        animationDuration={400}
        showValuesAsDataPointsText={true}
      />
    </ScrollView>
  );
}
