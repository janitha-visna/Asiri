import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export function AnalyticsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="h-52 items-center justify-center gap-3 rounded-lg bg-destructive/5">
      <Text className="text-sm font-medium text-destructive">
        Couldn't load analytics data.
      </Text>
      <Button variant="destructive" size="sm" onPress={onRetry} className="bg-red-600">
        Retry
      </Button>
    </View>
  );
}
