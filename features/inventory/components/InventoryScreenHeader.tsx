import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";

export function InventoryScreenHeader({
  title,
  subtitle,
  mode = "back",
}: {
  title: string;
  subtitle?: string;
  mode?: "back" | "close";
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-border bg-background px-4 py-3">
      <View className="flex-row items-center gap-3">
        {mode === "back" && (
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color="#71717a" />
          </Pressable>
        )}
        <View>
          <Text className="text-lg font-semibold text-foreground">{title}</Text>
          {subtitle && (
            <Text className="text-xs text-muted-foreground">{subtitle}</Text>
          )}
        </View>
      </View>
      {mode === "close" && (
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Text className="text-lg text-muted-foreground">✕</Text>
        </Pressable>
      )}
    </View>
  );
}
