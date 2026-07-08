import { useMemo, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { formatDateKey, formatDateLabel } from "../electricity.constants";
import type { MeterReadingInput } from "../electricity.types";

export function MeterReadingForm({
  onSave,
  isSaving,
}: {
  onSave: (input: MeterReadingInput) => Promise<void>;
  isSaving: boolean;
}) {
  const today = useMemo(() => new Date(), []);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const startValue = Number(start);
  const endValue = Number(end);
  const hasValidNumbers =
    start.trim() !== "" &&
    end.trim() !== "" &&
    !Number.isNaN(startValue) &&
    !Number.isNaN(endValue);
  const consumption = hasValidNumbers ? endValue - startValue : null;

  const handleSave = async () => {
    setSaved(false);

    if (start.trim() === "" || end.trim() === "") {
      setError("Both start and end meter readings are required.");
      return;
    }
    if (!hasValidNumbers) {
      setError("Meter readings must be valid numbers.");
      return;
    }
    if (endValue < startValue) {
      setError("End meter reading must be greater than or equal to the start reading.");
      return;
    }

    setError(null);
    await onSave({
      date: formatDateKey(today),
      start: startValue,
      end: endValue,
    });
    setStart("");
    setEnd("");
    setSaved(true);
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Today's Date</Text>
        <View className="rounded-md border border-input bg-muted px-3 py-2">
          <Text className="text-base text-muted-foreground">
            {formatDateLabel(today)}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          Start Meter Reading
        </Text>
        <Input
          placeholder="e.g., 12450"
          value={start}
          onChangeText={(value) => {
            setStart(value);
            setError(null);
            setSaved(false);
          }}
          keyboardType="numeric"
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">
          End Meter Reading
        </Text>
        <Input
          placeholder="e.g., 12520"
          value={end}
          onChangeText={(value) => {
            setEnd(value);
            setError(null);
            setSaved(false);
          }}
          keyboardType="numeric"
        />
      </View>

      <View className="rounded-lg bg-primary/10 p-3">
        <Text className="text-xs font-medium text-muted-foreground">
          Calculated Consumption
        </Text>
        <Text className="text-lg font-bold text-primary">
          {consumption !== null && consumption >= 0 ? `${consumption} kWh` : "—"}
        </Text>
      </View>

      {error && (
        <Text className="text-sm font-medium text-destructive">{error}</Text>
      )}
      {saved && !error && (
        <Text className="text-sm font-medium text-green-600">
          Reading saved successfully.
        </Text>
      )}

      <Button
        variant="default"
        size="lg"
        onPress={handleSave}
        disabled={isSaving}
        className="w-full bg-green-600"
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </View>
  );
}
