import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function ElectricityErrorState({
  message = "Couldn't load electricity data.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <View className="h-40 items-center justify-center gap-3 rounded-lg bg-destructive/5 px-4">
      <Text className="text-center text-sm font-medium text-destructive">
        {message}
      </Text>
      <Button variant="destructive" size="sm" onPress={onRetry} className="bg-red-600">
        Retry
      </Button>
    </View>
  );
}
