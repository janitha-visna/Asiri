import { ScrollView, View } from "react-native";
import { DataEntryCard } from "./components/DataEntryCard";
import { DataEntryModal } from "./components/DataEntryModal";
import { DATA_ENTRY_FIELDS } from "./data-entry.constants";
import { useDataEntry } from "./useDataEntry";

export function DataEntryScreen() {
  const { values, activeField, openField, closeField, saveField } =
    useDataEntry();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-3">
        <View className="flex-row flex-wrap gap-3">
          {DATA_ENTRY_FIELDS.map((field) => (
            <DataEntryCard
              key={field.key}
              field={field}
              value={values[field.key]}
              onPress={openField}
            />
          ))}
        </View>
      </ScrollView>

      <DataEntryModal
        field={activeField}
        value={activeField ? values[activeField.key] : undefined}
        onClose={closeField}
        onSave={saveField}
      />
    </View>
  );
}
