import React, { createContext, useMemo } from "react";
import { Coworkers } from "@/data/sampleData";
import { useFetchCoworkers } from "@/lib/hooks";

type CoworkersContext = {
  apiData: Coworkers[] | null;
};

export const CoworkersContext = createContext<CoworkersContext | null>(null);

export default function CoworkersContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { apiData } = useFetchCoworkers();

  const contextValue = useMemo(
    () => ({
      apiData,
    }),
    [apiData]
  );
  return (
    <CoworkersContext.Provider value={contextValue}>
      {children}
    </CoworkersContext.Provider>
  );
}
