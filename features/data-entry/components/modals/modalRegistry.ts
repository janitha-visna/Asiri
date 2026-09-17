// features/data-entry/components/modals/modalRegistry.ts
import type { ComponentType } from "react";
import type { DataEntryModalKey } from "../../data-entry.types"; // 👈 Use DataEntryModalKey
import type { DataEntryModalContentProps } from "./ModalContent.types";
import { VehicleNumberModal } from "./VehicleNumberModal";
import { TelephoneNumberModal } from "./TelephoneNumberModal";
import { DateModal } from "./DateModal";
import { TotalPriceModal } from "./TotalPriceModal";
import { ServiceTypeModal } from "./ServiceTypeModal";
import { OdometerReadingModal } from "./OdometerReadingModal";

export const MODAL_CONTENT_REGISTRY: Record<
  DataEntryModalKey, // 👈 Fixes the error!
  ComponentType<DataEntryModalContentProps>
> = {
  vehicleNumber: VehicleNumberModal,
  telephoneNumber: TelephoneNumberModal,
  date: DateModal,
  totalPrice: TotalPriceModal,
  serviceType: ServiceTypeModal,
  odometerReading: OdometerReadingModal,
};
