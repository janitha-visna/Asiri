// features/data-entry/data-entry.reducer.ts
import type {
  DraftPhone,
  ServiceJobDraft,
  VehicleDto,
} from "./data-entry.types";
import { newKey, normalizePlate, todayString } from "./data-entry.utils";

/**
 * Creates a fresh, empty draft state.
 */
export const createInitialDraft = (): ServiceJobDraft => ({
  vehicle: {
    mode: "idle",
    id: null,
    numberPlate: "",
    categoryId: null,
    vehicleTypeId: null,
  },
  customer: {
    id: null,
    name: "",
    phones: [{ key: newKey(), number: "", isPrimary: true }],
  },
  jobDate: todayString(),
  meterReading: "",
  nextMeterReading: "",
  servicePackageId: null,
  services: {},
  totalCost: "",
  isPriceEdited: false,
});

export type DraftAction =
  | { type: "PLATE_CHANGED"; plate: string }
  | { type: "VEHICLE_MATCHED"; vehicle: VehicleDto }
  | { type: "VEHICLE_NOT_FOUND" }
  | { type: "CATEGORY_SELECTED"; categoryId: string }
  | { type: "TYPE_SELECTED"; vehicleTypeId: string }
  | { type: "CUSTOMER_NAME_CHANGED"; name: string }
  | { type: "PHONE_ADDED"; phone?: Partial<DraftPhone> }
  | { type: "PHONE_UPDATED"; key: string; number: string; id?: string }
  | { type: "PHONE_REMOVED"; key: string }
  | { type: "PHONE_SET_PRIMARY"; key: string }
  | { type: "DATE_CHANGED"; date: string }
  | { type: "METER_READING_CHANGED"; value: string }
  | { type: "NEXT_METER_READING_CHANGED"; value: string }
  | { type: "PACKAGE_SELECTED"; packageId: string }
  | { type: "SERVICE_TOGGLED"; serviceId: string }
  | {
      type: "PART_SELECTED";
      serviceId: string;
      componentId: string;
      partId: string;
    }
  | { type: "PRICE_EDITED"; value: string }
  | { type: "PRICE_RESET" }
  | { type: "DRAFT_RESET" };

export function draftReducer(
  state: ServiceJobDraft,
  action: DraftAction,
): ServiceJobDraft {
  switch (action.type) {
    case "PLATE_CHANGED": {
      const plate = normalizePlate(action.plate);
      if (plate === state.vehicle.numberPlate) return state;

      const initial = createInitialDraft();
      // Plate changed: reset vehicle, customer, and services to avoid cross-contamination
      return {
        ...state,
        vehicle: {
          ...initial.vehicle,
          numberPlate: plate,
          mode: plate.length >= 2 ? "idle" : "idle",
        },
        customer: initial.customer,
        services: {},
      };
    }

    case "VEHICLE_MATCHED": {
      const v = action.vehicle;
      return {
        ...state,
        vehicle: {
          mode: "registered",
          id: v.id,
          numberPlate: v.numberPlate,
          categoryId: v.category.id,
          vehicleTypeId: v.vehicleType.id,
        },
        customer: {
          id: v.customer.id,
          name: v.customer.name,
          phones:
            v.customer.phones.length > 0
              ? v.customer.phones.map((p) => ({
                  key: newKey(),
                  id: p.id,
                  number: p.phoneNumber,
                  isPrimary: p.isPrimary,
                }))
              : [{ key: newKey(), number: "", isPrimary: true }],
        },
        // Reset services so they match this newly loaded vehicle's type
        services: {},
      };
    }

    case "VEHICLE_NOT_FOUND":
      if (state.vehicle.mode === "new") return state;
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          mode: "new",
          id: null,
        },
      };

    case "CATEGORY_SELECTED":
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          categoryId: action.categoryId,
          vehicleTypeId: null, // Reset vehicle type when category changes
        },
        services: {}, // Reset services
      };

    case "TYPE_SELECTED":
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleTypeId: action.vehicleTypeId,
        },
        services: {}, // Reset services as available services depend on vehicle type
      };

    case "CUSTOMER_NAME_CHANGED":
      return {
        ...state,
        customer: { ...state.customer, name: action.name },
      };

    case "PHONE_ADDED": {
      const isFirst = state.customer.phones.length === 0;
      const phone: DraftPhone = {
        key: newKey(),
        number: "",
        isPrimary: isFirst,
        ...action.phone,
      };
      return {
        ...state,
        customer: {
          ...state.customer,
          phones: [...state.customer.phones, phone],
        },
      };
    }

    case "PHONE_UPDATED":
      return {
        ...state,
        customer: {
          ...state.customer,
          phones: state.customer.phones.map((p) =>
            p.key === action.key
              ? { ...p, number: action.number, id: action.id ?? p.id }
              : p,
          ),
        },
      };

    case "PHONE_REMOVED": {
      const phones = state.customer.phones;
      // Rule: Never remove the last phone number
      if (phones.length <= 1) return state;

      const removed = phones.find((p) => p.key === action.key);
      let remaining = phones.filter((p) => p.key !== action.key);

      // If removed phone was primary, automatically promote the first remaining phone
      if (removed?.isPrimary && remaining.length > 0) {
        remaining = remaining.map((p, idx) => ({
          ...p,
          isPrimary: idx === 0,
        }));
      }

      return {
        ...state,
        customer: { ...state.customer, phones: remaining },
      };
    }

    case "PHONE_SET_PRIMARY":
      return {
        ...state,
        customer: {
          ...state.customer,
          phones: state.customer.phones.map((p) => ({
            ...p,
            isPrimary: p.key === action.key,
          })),
        },
      };

    case "DATE_CHANGED":
      return { ...state, jobDate: action.date };

    case "METER_READING_CHANGED":
      return {
        ...state,
        meterReading: action.value.replace(/[^0-9]/g, ""),
      };

    case "NEXT_METER_READING_CHANGED":
      return {
        ...state,
        nextMeterReading: action.value.replace(/[^0-9]/g, ""),
      };

    case "PACKAGE_SELECTED":
      if (action.packageId === state.servicePackageId) return state;
      // When package changes, reset selected services
      return {
        ...state,
        servicePackageId: action.packageId,
        services: {},
      };

    case "SERVICE_TOGGLED": {
      const services = { ...state.services };
      if (services[action.serviceId]) {
        delete services[action.serviceId];
      } else {
        services[action.serviceId] = { partIdsByComponent: {} };
      }
      return { ...state, services };
    }

    case "PART_SELECTED": {
      const currentService = state.services[action.serviceId];
      if (!currentService) return state;

      return {
        ...state,
        services: {
          ...state.services,
          [action.serviceId]: {
            partIdsByComponent: {
              ...currentService.partIdsByComponent,
              [action.componentId]: action.partId,
            },
          },
        },
      };
    }

    case "PRICE_EDITED":
      return {
        ...state,
        totalCost: action.value,
        isPriceEdited: true,
      };

    case "PRICE_RESET":
      return {
        ...state,
        totalCost: "",
        isPriceEdited: false,
      };

    case "DRAFT_RESET":
      return createInitialDraft();

    default:
      return state;
  }
}
