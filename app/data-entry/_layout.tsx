import { DataEntryProvider } from "@/features/data-entry/DataEntryContext";
import { Stack } from "expo-router";

export default function DataEntryLayout() {
  return (
    <DataEntryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="[field]"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [1.0],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
      </Stack>
    </DataEntryProvider>
  );
}
