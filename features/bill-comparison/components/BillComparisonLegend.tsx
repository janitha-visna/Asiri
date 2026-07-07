import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { CURRENT_MONTH_COLOR, PREVIOUS_MONTH_COLOR } from "../bill-comparison.constants";

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <Text className="text-xs font-medium text-muted-foreground">{label}</Text>
    </View>
  );
}

export function BillComparisonLegend({
  previousMonth,
  currentMonth,
}: {
  previousMonth: string;
  currentMonth: string;
}) {
  return (
    <View className="flex-row items-center gap-4">
      <LegendItem color={PREVIOUS_MONTH_COLOR} label={previousMonth} />
      <LegendItem color={CURRENT_MONTH_COLOR} label={currentMonth} />
    </View>
  );
}
