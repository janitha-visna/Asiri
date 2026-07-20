import { Stack } from "expo-router";

export default function InventoryUsageLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[categoryId]/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="[categoryId]/reduce"
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
