import { DataEntryProvider } from "@/features/data-entry/DataEntryContext";
import { ServiceJobScreen } from "@/features/data-entry/ServiceJobScreen";

export default function DataEntryIndex() {
  return (
    <DataEntryProvider>
      <ServiceJobScreen />
    </DataEntryProvider>
  );
}
