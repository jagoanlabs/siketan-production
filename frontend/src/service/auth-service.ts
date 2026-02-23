import { axiosClient } from "./app-service";

import { RegisterPayload, RegisterResponse } from "@/types/auth";

export const loginApi = (payload: { email: string; password: string }) => {
  // payload: { email, password, role }
  return axiosClient.post("/auth/login", payload);
};

export const registerApi = (
  payload: RegisterPayload,
): Promise<RegisterResponse> => {
  return axiosClient.post("/auth/register", payload);
};
