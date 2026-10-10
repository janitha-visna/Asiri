// features/data-entry/components/sections/JobDateSection.tsx
import React, { useState } from "react";
import { View, Modal, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useDataEntryContext } from "../../DataEntryContext";
import { todayString } from "../../data-entry.utils";

function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateString(str?: string): Date {
  if (str) {
    const parts = str.split("-");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    }
  }
  return new Date();
}

function formatDisplayDate(dateStr: string): string {
  const date = parseDateString(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function JobDateSection() {
  const { draft, dispatch } = useDataEntryContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(parseDateString(draft.jobDate));

  const handleSetToday = () => {
    dispatch({ type: "DATE_CHANGED", date: todayString() });
  };

  const handleSetYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    dispatch({ type: "DATE_CHANGED", date: formatDateString(d) });
  };

  const handleConfirmCalendar = () => {
    const today = todayString();
    const formatted = formatDateString(tempDate);
    if (formatted > today) {
      alert("Job date cannot be in the future");
      return;
    }
    dispatch({ type: "DATE_CHANGED", date: formatted });
    setIsModalOpen(false);
  };

  const isToday = draft.jobDate === todayString();

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-3 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          3. Job Date
        </Text>
        <View className="flex-row items-center gap-2">
          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onPress={handleSetToday}
            className="h-7 px-2.5"
          >
            <Text
              className={`text-xs font-semibold ${
                isToday ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Today
            </Text>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onPress={handleSetYesterday}
            className="h-7 px-2.5"
          >
            <Text className="text-xs font-semibold text-muted-foreground">
              Yesterday
            </Text>
          </Button>
        </View>
      </View>

      {/* Date Display and Change Button */}
      <Pressable
        onPress={() => {
          setTempDate(parseDateString(draft.jobDate));
          setIsModalOpen(true);
        }}
        className="flex-row items-center justify-between rounded-lg border border-input bg-background/50 px-3.5 py-3 active:bg-muted/30"
      >
        <View>
          <Text className="text-xs text-muted-foreground">Selected Date</Text>
          <Text className="text-sm font-semibold text-foreground">
            {formatDisplayDate(draft.jobDate)} ({draft.jobDate})
          </Text>
        </View>
        <Text className="text-xs font-medium text-primary">Change Date 📅</Text>
      </Pressable>

      {/* Calendar Modal */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50 p-4"
          onPress={() => setIsModalOpen(false)}
        >
          <Pressable
            className="w-full max-w-sm rounded-xl bg-card p-4 gap-4"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-base font-bold text-foreground">
              Select Job Date
            </Text>

            <Calendar
              value={tempDate}
              onDateSelect={(d) => setTempDate(d)}
            />

            <View className="flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setIsModalOpen(false)}
              >
                <Text className="font-semibold text-foreground">Cancel</Text>
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-green-600"
                onPress={handleConfirmCalendar}
              >
                <Text className="font-semibold text-white">Apply</Text>
              </Button>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
