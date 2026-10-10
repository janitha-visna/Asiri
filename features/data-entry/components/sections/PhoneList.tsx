// features/data-entry/components/sections/PhoneList.tsx
import React from "react";
import { View, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useDataEntryContext } from "../../DataEntryContext";

export function PhoneList() {
  const { draft, dispatch } = useDataEntryContext();
  const phones = draft.customer.phones;

  const handleUpdateNumber = (key: string, number: string, id?: string) => {
    dispatch({ type: "PHONE_UPDATED", key, number, id });
  };

  const handleSetPrimary = (key: string) => {
    dispatch({ type: "PHONE_SET_PRIMARY", key });
  };

  const handleRemovePhone = (key: string) => {
    dispatch({ type: "PHONE_REMOVED", key });
  };

  const handleAddPhone = () => {
    dispatch({ type: "PHONE_ADDED" });
  };

  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-muted-foreground">
          Contact Phone Numbers
        </Text>
        <Button
          variant="outline"
          size="sm"
          onPress={handleAddPhone}
          className="h-7 px-2.5"
        >
          <Text className="text-xs font-semibold text-primary">+ Add Phone</Text>
        </Button>
      </View>

      {phones.map((phone, index) => (
        <View
          key={phone.key}
          className="flex-row items-center gap-2 rounded-lg border border-border bg-background/50 p-2"
        >
          {/* Phone Number Input */}
          <View className="flex-1">
            <Input
              placeholder={`Phone #${index + 1} (e.g., 0771234567)`}
              value={phone.number}
              onChangeText={(text) => handleUpdateNumber(phone.key, text, phone.id)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Primary Phone Toggle */}
          <Pressable
            onPress={() => handleSetPrimary(phone.key)}
            className={`rounded-md px-2.5 py-2 border ${
              phone.isPrimary
                ? "border-emerald-500 bg-emerald-500/15"
                : "border-border bg-muted/40"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                phone.isPrimary ? "text-emerald-600" : "text-muted-foreground"
              }`}
            >
              {phone.isPrimary ? "Primary ★" : "Set Primary"}
            </Text>
          </Pressable>

          {/* Remove Phone Button (only shown if more than 1 phone) */}
          {phones.length > 1 && (
            <Button
              variant="destructive"
              size="sm"
              onPress={() => handleRemovePhone(phone.key)}
              className="h-9 px-3 bg-red-600/90"
            >
              <Text className="text-xs font-semibold text-white">✕</Text>
            </Button>
          )}
        </View>
      ))}
    </View>
  );
}
