import { useState } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useBillComparisonData } from "../useBillComparisonData";
import { BillComparisonBarChart } from "./BillComparisonBarChart";
import { BillComparisonEmptyState } from "./BillComparisonEmptyState";
import { BillComparisonErrorState } from "./BillComparisonErrorState";
import { BillComparisonLegend } from "./BillComparisonLegend";
import { BillComparisonSkeleton } from "./BillComparisonSkeleton";

const CURRENT_YEAR = new Date().getFullYear();

export function BillComparisonCard() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const { status, response, retry } = useBillComparisonData(year);

  const handlePreviousYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    if (year < CURRENT_YEAR) {
      setYear(year + 1);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-2">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 gap-1">
            <Text className="text-base font-semibold text-foreground">
              Average Bill Comparison by Vehicle Type
            </Text>
            <Text className="text-xs text-muted-foreground">
              {response
                ? `${response.currentMonth} vs ${response.previousMonth}`
                : `${year} vs ${year - 1}`}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={handlePreviousYear}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-muted"
            >
              <Ionicons name="chevron-back" size={16} color="#71717a" />
            </Pressable>
            <Text className="min-w-[40px] text-center text-sm font-semibold text-foreground">
              {year}
            </Text>
            <Pressable
              onPress={handleNextYear}
              disabled={year >= CURRENT_YEAR}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-muted disabled:opacity-30"
            >
              <Ionicons name="chevron-forward" size={16} color="#71717a" />
            </Pressable>
          </View>
        </View>
        {status === "success" && response && (
          <BillComparisonLegend
            previousMonth={response.previousMonth}
            currentMonth={response.currentMonth}
          />
        )}
      </CardHeader>
      <CardContent className="gap-2">
        {status === "loading" && <BillComparisonSkeleton />}
        {status === "error" && <BillComparisonErrorState onRetry={retry} />}
        {status === "empty" && <BillComparisonEmptyState />}
        {status === "success" && response && (
          <>
            <Text className="text-[10px] text-muted-foreground">
              Average Bill ({response.currency})
            </Text>
            <BillComparisonBarChart response={response} />
            <Text className="text-center text-[10px] text-muted-foreground">
              Vehicle Type
            </Text>
          </>
        )}
      </CardContent>
    </Card>
  );
}
