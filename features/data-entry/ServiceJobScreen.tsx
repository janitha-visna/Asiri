// features/data-entry/ServiceJobScreen.tsx
import React from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useDataEntryContext } from "./DataEntryContext";
import {
  VehicleSection,
  CustomerSection,
  JobDateSection,
  MeterReadingSection,
  ServicePackageSection,
  ServiceList,
  PriceSection,
  SaveBar,
} from "./components/sections";

export function ServiceJobScreen() {
  const insets = useSafeAreaInsets();
  const { draft, dispatch } = useDataEntryContext();

  const handleResetForm = () => {
    Alert.alert(
      "Reset Form",
      "Are you sure you want to discard all entered details and start fresh?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => dispatch({ type: "DRAFT_RESET" }),
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* Screen Header */}
      <View className="flex-row items-center justify-between border-b border-border bg-card px-4 py-3">
        <View>
          <Text className="text-lg font-bold text-foreground">
            Service Job Entry
          </Text>
          <Text className="text-xs text-muted-foreground">
            {draft.vehicle.numberPlate
              ? `Job for: ${draft.vehicle.numberPlate}`
              : "Create customer service job"}
          </Text>
        </View>

        <Button
          variant="outline"
          size="sm"
          onPress={handleResetForm}
          className="h-8 px-2.5"
        >
          <Text className="text-xs font-semibold text-muted-foreground">
            Reset
          </Text>
        </Button>
      </View>

      {/* Main Form Body */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 p-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <VehicleSection />
          <CustomerSection />
          <JobDateSection />
          <MeterReadingSection />
          <ServicePackageSection />
          <ServiceList />
          <PriceSection />
        </ScrollView>

        {/* Sticky Save Bar */}
        <View style={{ paddingBottom: insets.bottom }}>
          <SaveBar />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
