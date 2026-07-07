import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { NON_REPEAT_COLOR, REPEAT_COLOR } from "../analytics.constants";

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

export function RepeatVehicleLegend() {
  return (
    <View className="flex-row items-center gap-4">
      <LegendItem color={REPEAT_COLOR} label="Repeat Vehicles" />
      <LegendItem color={NON_REPEAT_COLOR} label="Non-Repeat Vehicles" />
    </View>
  );
}
