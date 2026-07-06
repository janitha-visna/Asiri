import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useRevenueData } from "../useRevenueData";
import { RevenueChartEmptyState } from "./RevenueChartEmptyState";
import { RevenueChartErrorState } from "./RevenueChartErrorState";
import { RevenueChartSkeleton } from "./RevenueChartSkeleton";
import { RevenueLineChart } from "./RevenueLineChart";

const CURRENT_YEAR = new Date().getFullYear();

export function RevenueChartCard() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const { status, data, retry } = useRevenueData(year);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base text-foreground">
          Yearly Revenue
        </CardTitle>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => setYear((y) => y - 1)}
            hitSlop={8}
            className="h-7 w-7 items-center justify-center rounded-full bg-muted"
          >
            <Ionicons name="chevron-back" size={16} color="#71717a" />
          </Pressable>
          <Text className="min-w-[40px] text-center text-sm font-semibold text-foreground">
            {year}
          </Text>
          <Pressable
            onPress={() => setYear((y) => Math.min(y + 1, CURRENT_YEAR))}
            disabled={year >= CURRENT_YEAR}
            hitSlop={8}
            className="h-7 w-7 items-center justify-center rounded-full bg-muted disabled:opacity-30"
          >
            <Ionicons name="chevron-forward" size={16} color="#71717a" />
          </Pressable>
        </View>
      </CardHeader>
      <CardContent>
        {status === "loading" && <RevenueChartSkeleton />}
        {status === "error" && <RevenueChartErrorState onRetry={retry} />}
        {status === "empty" && <RevenueChartEmptyState year={year} />}
        {status === "success" && <RevenueLineChart data={data} />}
      </CardContent>
    </Card>
  );
}
