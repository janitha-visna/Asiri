// features/data-entry/components/sections/CustomerSection.tsx
import React from "react";
import { View } from "react-native";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import { PhoneList } from "./PhoneList";

export function CustomerSection() {
  const { draft, dispatch } = useDataEntryContext();

  return (
    <View className="rounded-xl border border-border bg-card p-4 gap-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-foreground">
          2. Customer Details
        </Text>
        {draft.customer.id && (
          <View className="rounded-full bg-blue-500/15 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-blue-600">
              Registered Customer
            </Text>
          </View>
        )}
      </View>

      {/* Customer Name Input */}
      <View className="gap-1.5">
        <Text className="text-xs font-medium text-muted-foreground">
          Customer Full Name
        </Text>
        <Input
          placeholder="e.g., Sunil Perera"
          value={draft.customer.name}
          onChangeText={(name) => dispatch({ type: "CUSTOMER_NAME_CHANGED", name })}
        />
      </View>

      {/* Phone Numbers List */}
      <PhoneList />
    </View>
  );
}
