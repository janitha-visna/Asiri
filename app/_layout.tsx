// app/_layout.tsx
import "../global.css";
import { Drawer } from "expo-router/drawer";
import { PortalHost } from "@rn-primitives/portal";
import { InventoryProvider } from "@/features/inventory/InventoryContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    console.log("them change", colorScheme);
    console.log("defualt theme", JSON.stringify(DefaultTheme, null, 2));
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <InventoryProvider>
        <Drawer>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Home",
              title: "Home",
            }}
          />
          <Drawer.Screen
            name="data-entry"
            options={{
              drawerLabel: "Data Entry",
              title: "Data Entry",
            }}
          />
          <Drawer.Screen
            name="analytics"
            options={{
              drawerLabel: "Analytics",
              title: "Analytics",
            }}
          />
          <Drawer.Screen
            name="revenue-analytics"
            options={{
              drawerLabel: "Revenue",
              title: "Revenue Analytics",
            }}
          />
          <Drawer.Screen
            name="electricity"
            options={{
              drawerLabel: "Electricity Consumption",
              title: "Electricity Consumption",
            }}
          />
          <Drawer.Screen
            name="inventory"
            options={{
              drawerLabel: "Inventory",
              title: "Inventory",
            }}
          />
          <Drawer.Screen
            name="inventory-usage"
            options={{
              drawerLabel: "Inventory Usage",
              title: "Inventory Usage",
            }}
          />
        </Drawer>
        <PortalHost />
      </InventoryProvider>
    </ThemeProvider>
    </QueryClientProvider>
  );
}
