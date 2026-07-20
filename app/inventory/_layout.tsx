import { Stack } from "expo-router";

export default function InventoryLayout() {
  return (
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
      <Stack.Screen name="[categoryId]/index" options={{ headerShown: false }} />
      <Stack.Screen name="[categoryId]/stock" options={{ headerShown: false }} />
      <Stack.Screen
        name="[categoryId]/add-variant"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [1.0],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="[categoryId]/add-stock"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [1.0],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
