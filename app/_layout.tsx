// app/_layout.tsx
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Drawer } from "expo-router/drawer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import "../global.css";

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
      }),
  );

  useEffect(() => {
    console.log("them change", colorScheme);
    console.log("defualt theme", JSON.stringify(DefaultTheme, null, 2));
  }, [colorScheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

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
            name="service-pricing"
            options={{
              drawerLabel: "Service Pricing",
              title: "Service Pricing Master",
            }}
          />
        </Drawer>
        <PortalHost />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
