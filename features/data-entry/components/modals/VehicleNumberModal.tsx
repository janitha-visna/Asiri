import { Text } from "react-native";
import type { DataEntryModalContentProps } from "./ModalContent.types";

export function VehicleNumberModal({ value }: DataEntryModalContentProps) {
  return (
    <Text className="text-gray-500">
      Vehicle Number content coming soon. Current value: {value || "none"}
    </Text>
  );
}
