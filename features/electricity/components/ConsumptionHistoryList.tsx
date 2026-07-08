import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  UIManager,
  View,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { MeterReading } from "../electricity.types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLLAPSED_COUNT = 3;

function ReadingRow({ reading }: { reading: MeterReading }) {
  return (
    <Card>
      <CardContent className="gap-1 p-3">
        <Text className="text-sm font-semibold text-foreground">
          {reading.dateLabel}
        </Text>
        <View className="flex-row flex-wrap gap-x-4">
          <Text className="text-xs text-muted-foreground">
            Start: {reading.start.toLocaleString()}
          </Text>
          <Text className="text-xs text-muted-foreground">
            End: {reading.end.toLocaleString()}
          </Text>
        </View>
        <Text className="text-sm font-bold text-blue-600">
          Consumption: {reading.consumption} kWh
        </Text>
      </CardContent>
    </Card>
  );
}

export function ConsumptionHistoryList({
  readings,
}: {
  readings: MeterReading[];
}) {
  const [expanded, setExpanded] = useState(false);

  const visibleReadings = expanded
    ? readings
    : readings.slice(0, COLLAPSED_COUNT);
  const canToggle = readings.length > COLLAPSED_COUNT;

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <View className="gap-2">
      {visibleReadings.map((reading) => (
        <ReadingRow key={reading.id} reading={reading} />
      ))}

      {canToggle && (
        <Button variant="secondary" size="sm" onPress={toggleExpanded}>
          {expanded ? "Show Less" : "View Past 7 Days"}
        </Button>
      )}
    </View>
  );
}
