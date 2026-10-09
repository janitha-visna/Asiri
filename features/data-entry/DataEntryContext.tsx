// features/data-entry/DataEntryContext.tsx
import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  createInitialDraft,
  draftReducer,
  type DraftAction,
} from "./data-entry.reducer";
import type { ServiceJobDraft } from "./data-entry.types";

type DataEntryContextValue = {
  draft: ServiceJobDraft;
  dispatch: Dispatch<DraftAction>;
};

const DataEntryContext = createContext<DataEntryContextValue | null>(null);

export function DataEntryProvider({ children }: { children: ReactNode }) {
  // 1. Initialize the reducer with our initial empty draft state
  const [draft, dispatch] = useReducer(
    draftReducer,
    undefined,
    createInitialDraft
  );

  // 2. Memoize context value to prevent unnecessary re-renders of consuming components
  const value = useMemo(
    () => ({
      draft,
      dispatch,
    }),
    [draft]
  );

  return (
    <DataEntryContext.Provider value={value}>
      {children}
    </DataEntryContext.Provider>
  );
}

/**
 * Hook to consume the service job draft state and dispatch actions
 * from any section or modal sheet within the data-entry flow.
 */
export function useDataEntryContext() {
  const context = useContext(DataEntryContext);
  if (!context) {
    throw new Error(
      "useDataEntryContext must be used within a DataEntryProvider"
    );
  }
  return context;
}
