// features/service-pricing/service-pricing.mocks.ts
import type {
  ServicePricesMatrixResponse,
  UpdateServicePricesPayload,
} from "./service-pricing.types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_SERVICE_PRICES_MATRIX: ServicePricesMatrixResponse = {
  categories: [
    {
      categoryId: "1",
      categoryName: "Bike",
      vehicleTypes: [
        {
          id: "1",
          name: "Motorcycle",
        },
      ],
    },
    {
      categoryId: "2",
      categoryName: "Car",
      vehicleTypes: [
        {
          id: "2",
          name: "Small Car",
        },
        {
          id: "3",
          name: "Regular Car",
        },
      ],
    },
    {
      categoryId: "3",
      categoryName: "Cab",
      vehicleTypes: [
        {
          id: "4",
          name: "Single Cab",
        },
        {
          id: "5",
          name: "Double Cab",
        },
      ],
    },
    {
      categoryId: "4",
      categoryName: "Van",
      vehicleTypes: [
        {
          id: "6",
          name: "Regular Van",
        },
        {
          id: "7",
          name: "High Roof Van",
        },
        {
          id: "8",
          name: "Mini Van",
        },
      ],
    },
    {
      categoryId: "5",
      categoryName: "Bus",
      vehicleTypes: [
        {
          id: "9",
          name: "Small Bus",
        },
        {
          id: "10",
          name: "Tata Long Bus",
        },
        {
          id: "11",
          name: "Leyland Bus",
        },
      ],
    },
    {
      categoryId: "6",
      categoryName: "Lorry",
      vehicleTypes: [
        {
          id: "12",
          name: "10 1/2 Lorry",
        },
        {
          id: "13",
          name: "14 1/2 Lorry",
        },
      ],
    },
    {
      categoryId: "7",
      categoryName: "Commercial Vehicle",
      vehicleTypes: [
        {
          id: "14",
          name: "Demo Batta",
        },
      ],
    },
    {
      categoryId: "8",
      categoryName: "Tipper",
      vehicleTypes: [
        {
          id: "15",
          name: "Small Tipper",
        },
        {
          id: "16",
          name: "Big Tipper",
        },
      ],
    },
  ],
  services: [
    {
      id: "1",
      name: "Full Service",
    },
    {
      id: "2",
      name: "Normal Service",
    },
    {
      id: "3",
      name: "Body Wash",
    },
  ],
  prices: {
    "1_1": 1500,
    "1_2": 2000,
    "1_3": 4500,
    "1_4": 5500,
    "1_5": 6000,
    "1_6": 5000,
    "1_7": 6000,
    "1_8": 4500,
    "1_9": 9500,
    "1_10": 9000,
    "1_11": 13000,
    "1_12": 6500,
    "1_13": 7000,
    "1_14": 4500,
    "1_15": 7500,
    "1_16": 9000,
  },
};

let mockMatrixState: ServicePricesMatrixResponse = JSON.parse(
  JSON.stringify(MOCK_SERVICE_PRICES_MATRIX)
);

export async function getMockServicePricesMatrix(): Promise<ServicePricesMatrixResponse> {
  await delay(250);
  return JSON.parse(JSON.stringify(mockMatrixState));
}

export async function updateMockServicePrices(
  payload: UpdateServicePricesPayload
): Promise<{ success: boolean; updatedCount: number }> {
  await delay(350);
  for (const item of payload.prices) {
    const key = `${item.serviceId}_${item.vehicleTypeId}`;
    mockMatrixState.prices[key] = item.price;
  }
  return { success: true, updatedCount: payload.prices.length };
}
