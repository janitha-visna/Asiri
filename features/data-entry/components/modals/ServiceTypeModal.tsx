import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function ServiceTypeModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Service Type content coming soon. Current value: {value || "none"}
    </Text>
  );
}
