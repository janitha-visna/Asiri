import { View } from "react-native";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useBillComparisonData } from "../useBillComparisonData";
import { BillComparisonBarChart } from "./BillComparisonBarChart";
import { BillComparisonEmptyState } from "./BillComparisonEmptyState";
import { BillComparisonErrorState } from "./BillComparisonErrorState";
import { BillComparisonLegend } from "./BillComparisonLegend";
import { BillComparisonSkeleton } from "./BillComparisonSkeleton";

export function BillComparisonCard() {
  const { status, response, retry } = useBillComparisonData();

  return (
    <Card>
      <CardHeader className="gap-2">
        <View className="gap-1">
          <Text className="text-base font-semibold text-foreground">
            Average Bill Comparison by Vehicle Type
          </Text>
          <Text className="text-xs text-muted-foreground">
            {response
              ? `${response.currentMonth} ${response.year} vs ${response.previousMonth} ${response.year}`
              : "Current Month vs Previous Month"}
          </Text>
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
