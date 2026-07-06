import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Text } from "@/components/ui/text";
import type { DataEntryModalContentProps } from "./ModalContent.types";

/**
 * Parses a date string (YYYY-MM-DD format) or returns today's date
 */
function parseDate(dateString?: string): Date {
  if (dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2])
      );
    }
  }
  return new Date();
}

/**
 * Formats a Date object to YYYY-MM-DD string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object to a readable display string (e.g., "January 6, 2026")
 */
function formatDateDisplay(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export function DateModal({
  value,
  onSave,
  onClose,
}: DataEntryModalContentProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(parseDate(value));

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    onSave(formatDate(selectedDate));
  };

  return (
    <View className="flex-1 gap-5">
      {/* Selected Date Display */}
      <View className="rounded-lg bg-primary/10 p-4">
        <Text className="text-xs font-medium text-muted-foreground mb-1">
          Selected Date
        </Text>
        <Text className="text-2xl font-bold text-primary">
          {formatDateDisplay(selectedDate)}
        </Text>
      </View>

      {/* Calendar */}
      <Calendar value={selectedDate} onDateSelect={handleSelectDate} />

      {/* Spacer to push buttons to bottom */}
      <View className="flex-1" />

      {/* Confirm Button */}
      <Button
        variant="default"
        size="lg"
        onPress={handleConfirm}
        className="w-full bg-green-600"
      >
        Confirm Date
      </Button>

      {/* Cancel Button */}
      <Button
        variant="destructive"
        size="lg"
        onPress={onClose}
        className="w-full bg-red-600"
      >
        Cancel
      </Button>
    </View>
  );
}
