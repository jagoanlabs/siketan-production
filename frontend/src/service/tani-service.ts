import { axiosClient } from "./app-service";

import { EventTaniResponse, InfoTaniResponse } from "@/types/tani";

export const eventTani = (): Promise<EventTaniResponse> => {
  return axiosClient.get("/event-tani");
};

export const infoTani = (): Promise<InfoTaniResponse> => {
  return axiosClient.get("/info-tani");
};
