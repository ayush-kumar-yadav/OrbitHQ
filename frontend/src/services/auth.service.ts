import { api } from "../api/client";

import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
} from "../types/auth";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      data
    );

    return response.data;
  },
  

  register: async (data: RegisterRequest) => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      data
    );

    return response.data;
  },

  me: async () => {
    const response = await api.get("/auth/me");

    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");

    return response.data;
  },
};