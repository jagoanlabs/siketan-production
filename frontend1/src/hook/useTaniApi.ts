import { useQuery } from "@tanstack/react-query";

import { eventTani, infoTani } from "@/service/tani-service";
import { EventTaniResponse, InfoTaniResponse } from "@/types/tani";

// Hook untuk Event Tani
export const useEventTani = () => {
  return useQuery<EventTaniResponse, Error>({
    queryKey: ["eventTani"],
    queryFn: eventTani,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook untuk Info Tani
export const useInfoTani = () => {
  return useQuery<InfoTaniResponse, Error>({
    queryKey: ["infoTani"],
    queryFn: infoTani,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Combined hook untuk keduanya
export const useTaniData = () => {
  const eventQuery = useEventTani();
  const infoQuery = useInfoTani();

  return {
    // Event Data
    eventData: eventQuery.data?.infotani || [], // DIUBAH
    eventLoading: eventQuery.isLoading,
    eventError: eventQuery.error,
    eventRefetch: eventQuery.refetch,

    // Info Data
    infoData: infoQuery.data?.infotani || [],
    infoLoading: infoQuery.isLoading,
    infoError: infoQuery.error,
    infoRefetch: infoQuery.refetch,

    // Combined states
    isLoading: eventQuery.isLoading || infoQuery.isLoading,
    isError: eventQuery.isError || infoQuery.isError,
    error: eventQuery.error || infoQuery.error,
  };
};
