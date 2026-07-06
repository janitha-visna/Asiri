import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { DataEntryCard } from "./components/DataEntryCard";
import { DATA_ENTRY_FIELDS } from "./data-entry.constants";
import { useDataEntryContext } from "./DataEntryContext";

export function DataEntryListScreen() {
  const { values } = useDataEntryContext();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-3" contentContainerClassName="pb-4">
        <View className="flex-row flex-wrap gap-3">
          {DATA_ENTRY_FIELDS.map((field) => (
            <DataEntryCard
              key={field.key}
              field={field}
              value={values[field.key]}
              onPress={() =>
                router.push({
                  pathname: "/data-entry/[field]",
                  params: { field: field.key },
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
