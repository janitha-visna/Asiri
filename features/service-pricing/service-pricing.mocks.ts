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
    "2_2": 5000,
    "3_2": 5500,
    "2_1": 5500,
    "3_1": 6000,
    "1_15": 6000,
    "1_3": 1500,
    "2_3": 2000,
    "3_3": 1000,
    "1_4": 2500,
    "2_4": 2000,
    "3_4": 1000,
    "1_5": 2500,
    "2_5": 2000,
    "3_5": 1000,
    "1_6": 2500,
    "2_6": 2000,
    "3_6": 1000,
    "1_7": 3000,
    "2_7": 2500,
    "3_7": 1000,
    "1_8": 3000,
    "2_8": 2500,
    "3_8": 1000,
    "1_9": 3000,
    "2_9": 2000,
    "3_9": 1000,
    "1_10": 3000,
    "2_10": 2500,
    "3_10": 1000,
    "1_11": 3000,
    "2_11": 2500,
    "3_11": 1000,
    "1_12": 3000,
    "2_12": 2500,
    "3_12": 1000,
    "1_13": 3000,
    "2_13": 2500,
    "3_13": 1000,
    "1_14": 3000,
    "2_14": 2500,
    "3_14": 1000,
    "2_15": 4500,
    "3_15": 1000,
    "1_16": 5000,
    "2_16": 2500,
    "3_16": 1000,
    "1_1": 1500,
    "1_2": 2000,
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
