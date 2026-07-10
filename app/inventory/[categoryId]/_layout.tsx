import { Stack } from "expo-router";

export default function CategoryLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="stock" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-variant"
        options={{
          presentation: "formSheet",
          sheetAllowedDetents: [1.0],
          sheetGrabberVisible: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-stock"
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
