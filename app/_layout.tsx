import "../global.css";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
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
    </Drawer>
  );
}
