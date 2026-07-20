import "../global.css";
import { Drawer } from "expo-router/drawer";
import { PortalHost } from "@rn-primitives/portal";
import { InventoryProvider } from "@/features/inventory/InventoryContext";

export default function RootLayout() {
  return (
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
  );
}
