import { Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DataEntryField } from "../data-entry.types";

type DataEntryCardProps = {
  field: DataEntryField;
  value?: string;
  onPress: (field: DataEntryField) => void;
};

export function DataEntryCard({ field, value, onPress }: DataEntryCardProps) {
  return (
    <Pressable onPress={() => onPress(field)} className="mb-3 active:opacity-70">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>{field.label}</CardTitle>
        </CardHeader>
        <CardContent>
          <Text>{value || "Tap to set"}</Text>
        </CardContent>
      </Card>
    </Pressable>
  );
}
