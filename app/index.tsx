import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BillComparisonCard } from "@/features/bill-comparison/components/BillComparisonCard";
import { RevenueChartCard } from "@/features/revenue-chart/components/RevenueChartCard";

export default function Index() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <RevenueChartCard />
      <BillComparisonCard />
    </ScrollView>
  );
}
