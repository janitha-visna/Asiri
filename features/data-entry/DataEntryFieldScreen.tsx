import { router, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { MODAL_CONTENT_REGISTRY } from "./components/modals/modalRegistry";
import { DATA_ENTRY_FIELDS } from "./data-entry.constants";
import type { DataEntryFieldKey } from "./data-entry.types";
import { useDataEntryContext } from "./DataEntryContext";

export function DataEntryFieldScreen() {
  const { field: fieldKey } = useLocalSearchParams<{
    field: DataEntryFieldKey;
  }>();
  const { values, saveField } = useDataEntryContext();

  const field = DATA_ENTRY_FIELDS.find((f) => f.key === fieldKey);

  if (!field) return null;

  const ModalContent = MODAL_CONTENT_REGISTRY[field.key];

  return (
    <View className="flex-1 gap-4 bg-background p-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-foreground">
          {field.label}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text className="text-lg text-muted-foreground">✕</Text>
        </Pressable>
      </View>
      <ModalContent
        value={values[field.key]}
        onClose={() => router.back()}
        onSave={(value) => {
          saveField(field.key, value);
          router.back();
        }}
      />
    </View>
  );
}
