// features/data-entry/components/sections/SaveBar.tsx
import React from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useDataEntryContext } from "../../DataEntryContext";
import {
  useAvailableServices,
  useCreateServiceJobMutation,
} from "../../hooks/queries";
import {
  estimateCost,
  validateDraft,
  buildCreatePayload,
} from "../../data-entry.utils";
import { ApiError } from "@/lib/api/client";

export function SaveBar() {
  const { draft, dispatch } = useDataEntryContext();

  const { data: services = [] } = useAvailableServices(
    draft.vehicle.vehicleTypeId ?? undefined,
    draft.servicePackageId ?? undefined
  );

  const mutation = useCreateServiceJobMutation();

  const errors = validateDraft(draft, services);
  const errorKeys = Object.keys(errors);
  const isValid = errorKeys.length === 0;

  const estimatedCost = estimateCost(draft, services);
  const displayPrice = draft.isPriceEdited && draft.totalCost
    ? `Rs. ${Number(draft.totalCost).toLocaleString()}`
    : estimatedCost !== null
    ? `Rs. ${estimatedCost.toLocaleString()}`
    : "TBD on Save";

  const handleSave = () => {
    if (!isValid) {
      const firstErrorMessage = errors[errorKeys[0] as keyof typeof errors];
      Alert.alert("Incomplete Details", firstErrorMessage ?? "Please check all required fields.");
      return;
    }

    const payload = buildCreatePayload(draft);

    mutation.mutate(payload, {
      onSuccess: (data) => {
        Alert.alert(
          "Job Created Successfully",
          `Service Job #${data.id} has been recorded.\nTotal: Rs. ${Number(data.totalCost).toLocaleString()}`,
          [
            {
              text: "Create Another Job",
              onPress: () => dispatch({ type: "DRAFT_RESET" }),
            },
          ]
        );
      },
      onError: (err) => {
        if (err instanceof ApiError && err.status === 409) {
          Alert.alert(
            "Vehicle Already Exists",
            "This vehicle plate is already registered in the system.",
            [
              {
                text: "Refresh Plate",
                onPress: () =>
                  dispatch({
                    type: "PLATE_CHANGED",
                    plate: draft.vehicle.numberPlate,
                  }),
              },
              { text: "Cancel", style: "cancel" },
            ]
          );
          return;
        }

        Alert.alert(
          "Failed to Save Job",
          err.message || "An unexpected error occurred while saving the service job."
        );
      },
    });
  };

  return (
    <View className="border-t border-border bg-card/95 p-4 gap-2 shadow-lg">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-muted-foreground">Total Charge</Text>
          <Text className="text-xl font-extrabold text-foreground">
            {displayPrice}
          </Text>
        </View>

        <Button
          variant="default"
          size="lg"
          disabled={!isValid || mutation.isPending}
          onPress={handleSave}
          className={`min-w-[160px] ${
            !isValid || mutation.isPending
              ? "opacity-50 bg-muted"
              : "bg-green-600 active:bg-green-700"
          }`}
        >
          {mutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="font-bold text-white text-base">
              Save Service Job
            </Text>
          )}
        </Button>
      </View>

      {!isValid && (
        <Text className="text-center text-[11px] text-amber-600 dark:text-amber-400">
          ⚠ {errors[errorKeys[0] as keyof typeof errors]}
        </Text>
      )}
    </View>
  );
}
