import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function TelephoneNumberModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Telephone Number content coming soon. Current value: {value || "none"}
    </Text>
  );
}
