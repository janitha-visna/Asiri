import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { UNIT_OPTIONS } from "../inventory.constants";
import { useInventoryContext } from "../InventoryContext";
import type { InventoryUnit } from "../inventory.types";
import { InventoryScreenHeader } from "./InventoryScreenHeader";

export function CreateCategoryScreen() {
  const { addCategory } = useInventoryContext();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState<InventoryUnit | "">("");
  const [hasVariants, setHasVariants] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter an inventory item name.");
      return;
    }
    if (!unit) {
      setError("Please select a unit of measurement.");
      return;
    }

    addCategory({ name: name.trim(), unit, hasVariants });
    router.back();
  };

  return (
    <View className="flex-1 bg-background">
      <InventoryScreenHeader title="New Inventory Category" mode="close" />
      <ScrollView className="flex-1 p-4" contentContainerClassName="gap-5">
        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Inventory Item Name
          </Text>
          <Input
            placeholder="e.g., Engine Oil"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setError(null);
            }}
          />
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-foreground">
            Unit of Measurement
          </Text>
          <Select
            items={UNIT_OPTIONS}
            value={unit}
            onValueChange={(value) => {
              setUnit(value as InventoryUnit);
              setError(null);
            }}
            placeholder="Select unit"
          />
        </View>

        <View className="flex-row items-center justify-between rounded-lg border border-border p-3">
          <View className="flex-1 gap-0.5 pr-3">
            <Text className="text-sm font-medium text-foreground">
              This item has variants
            </Text>
            <Text className="text-xs text-muted-foreground">
              e.g., Engine Oil has multiple brands or types
            </Text>
          </View>
          <Switch value={hasVariants} onValueChange={setHasVariants} />
        </View>

        {error && (
          <Text className="text-sm font-medium text-destructive">{error}</Text>
        )}

        <View className="gap-3">
          <Button
            variant="default"
            size="lg"
            onPress={handleSave}
            className="w-full bg-green-600"
          >
            Save
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onPress={() => router.back()}
            className="w-full bg-red-600"
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
