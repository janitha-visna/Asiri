import { ScrollView } from "react-native";
import { RevenueChartCard } from "@/features/revenue-chart/components/RevenueChartCard";

export default function Index() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-4"
    >
      <RevenueChartCard />
    </ScrollView>
  );
}
