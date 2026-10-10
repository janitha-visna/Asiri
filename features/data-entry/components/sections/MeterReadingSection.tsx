// features/data-entry/components/sections/MeterReadingSection.tsx
import React from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";

export function MeterReadingSection() {
  const { draft, dispatch } = useDataEntryContext();

  const isInvalidSequence =
    Boolean(draft.meterReading) &&
    Boolean(draft.nextMeterReading) &&
    Number(draft.nextMeterReading) <= Number(draft.meterReading);

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          4. Meter Readings (km)
        </Text>
        <Text className="text-xs text-muted-foreground">Optional</Text>
      </View>

      <View className="flex-row gap-3">
        {/* Current Reading */}
        <View className="flex-1 gap-1.5">
          <Text className="text-xs font-medium text-muted-foreground">
            Current Reading
          </Text>
          <Input
            placeholder="e.g., 45000"
            value={draft.meterReading}
            onChangeText={(value) =>
              dispatch({ type: "METER_READING_CHANGED", value })
            }
            keyboardType="number-pad"
          />
        </View>

        {/* Next Reading */}
        <View className="flex-1 gap-1.5">
          <Text className="text-xs font-medium text-muted-foreground">
            Next Service Due
          </Text>
          <Input
            placeholder="e.g., 50000"
            value={draft.nextMeterReading}
            onChangeText={(value) =>
              dispatch({ type: "NEXT_METER_READING_CHANGED", value })
            }
            keyboardType="number-pad"
          />
        </View>
      </View>

      {isInvalidSequence && (
        <View className="rounded-lg bg-destructive/10 px-3 py-2">
          <Text className="text-xs font-semibold text-destructive">
            ⚠ Next reading must be greater than current reading ({draft.meterReading} km).
          </Text>
        </View>
      )}
    </View>
  );
}
