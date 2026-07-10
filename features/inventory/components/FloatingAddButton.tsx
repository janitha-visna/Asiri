import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FloatingAddButton({ onPress }: { onPress: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      style={{ bottom: insets.bottom + 24 }}
      className="absolute right-6 h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg active:opacity-80"
    >
      <Ionicons name="add" size={28} color="#ffffff" />
    </Pressable>
  );
}
