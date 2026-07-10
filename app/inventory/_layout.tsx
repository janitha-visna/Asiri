import { InventoryProvider } from "@/features/inventory/InventoryContext";
import { Stack } from "expo-router";

export default function InventoryLayout() {
  return (
    <InventoryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="create"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: [1.0],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
        <Stack.Screen name="[categoryId]" options={{ headerShown: false }} />
      </Stack>
    </InventoryProvider>
  );
}
