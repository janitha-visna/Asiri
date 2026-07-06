import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface CalendarProps {
  value?: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({ value, onDateSelect }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    value ? new Date(value.getFullYear(), value.getMonth()) : today
  );
  const [selectedDate, setSelectedDate] = useState(
    value || new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDatePress = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    onDateSelect(newDate);
  };

  const isSelectedDate = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View className="gap-4">
      {/* Month/Year Header */}
      <View className="flex-row items-center justify-between">
        <Pressable onPress={handlePrevMonth} className="p-2">
          <Text className="text-lg font-bold text-foreground">&lt;</Text>
        </Pressable>
        <Text className="text-base font-semibold text-foreground">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <Pressable onPress={handleNextMonth} className="p-2">
          <Text className="text-lg font-bold text-foreground">&gt;</Text>
        </Pressable>
      </View>

      {/* Week Days Header */}
      <View className="flex-row justify-between">
        {weekDays.map((day) => (
          <View key={day} className="flex-1 items-center py-2">
            <Text className="text-xs font-medium text-muted-foreground">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar Days Grid */}
      <View>
        {Array.from({ length: Math.ceil((daysInMonth + firstDay) / 7) }).map(
          (_, weekIndex) => (
            <View key={weekIndex} className="flex-row justify-between">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const dayNumber =
                  weekIndex * 7 + dayIndex - firstDay + 1;
                const isValidDay =
                  dayNumber > 0 && dayNumber <= daysInMonth;

                return (
                  <Pressable
                    key={`${weekIndex}-${dayIndex}`}
                    onPress={() =>
                      isValidDay && handleDatePress(dayNumber)
                    }
                    disabled={!isValidDay}
                    className={cn(
                      "flex-1 items-center rounded-md py-2.5",
                      isValidDay && "active:opacity-70",
                      isSelectedDate(dayNumber) &&
                        "bg-primary",
                      isToday(dayNumber) && !isSelectedDate(dayNumber) &&
                        "border border-primary"
                    )}
                  >
                    {isValidDay && (
                      <Text
                        className={cn(
                          "text-sm font-medium",
                          isSelectedDate(dayNumber)
                            ? "text-primary-foreground font-semibold"
                            : "text-foreground"
                        )}
                      >
                        {dayNumber}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )
        )}
      </View>
    </View>
  );
}
