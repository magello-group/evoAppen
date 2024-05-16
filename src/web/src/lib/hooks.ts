import { CoworkersContext } from "@/contexts/CoworkersContextProvider";
import { FeedbackRoundsContext } from "@/contexts/FeedbackRoundsContextProvider";
import {
  Coworkers,
  dateInterFace,
  sampleData,
  sampleDataCoworkers,
} from "@/data/sampleData";
import { useContext, useEffect, useState } from "react";

export function useFeedbackRoundsContext() {
  const context = useContext(FeedbackRoundsContext);
  if (!context) {
    throw new Error(
      "useFeedbackroundsContext must be used within a useFeedbackroundsContext"
    );
  }
  return context;
}

export function useSearchFeedbackRounds() {
  const [apiData, setApiData] = useState<dateInterFace[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setTimeout(() => {
        setApiData(sampleData);
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const jsonData = await response.json(); */
        setApiData(sampleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { apiData } as const;
}

export function useCoworkersContext() {
  const context = useContext(CoworkersContext);
  if (!context) {
    throw new Error(
      "useCoworkersContext must be used within a useCoworkersContext"
    );
  }
  return context;
}

export function useFetchCoworkers() {
  const [apiData, setApiData] = useState<Coworkers[] | []>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const jsonData = await response.json(); */
        setApiData(sampleDataCoworkers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { apiData } as const;
}
