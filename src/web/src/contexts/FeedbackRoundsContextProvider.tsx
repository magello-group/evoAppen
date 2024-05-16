import React, { createContext, useMemo } from "react";
// import { dateInterFace } from "@/data/sampleData";
import { dateInterFace } from "@/data/sampleData";
import { useSearchFeedbackRounds } from "@/lib/hooks";

type FeedbackRoundsContext = {
  apiData: dateInterFace[] ;
};

export const FeedbackRoundsContext =
  createContext<FeedbackRoundsContext | null>(null);

export default function FeedbackRoundsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { apiData } = useSearchFeedbackRounds();

  const contextValue = useMemo(
    () => ({
      apiData,
    }),
    [apiData]
  );
  return (
    <FeedbackRoundsContext.Provider value={contextValue}>
      {children}
    </FeedbackRoundsContext.Provider>
  );
}
