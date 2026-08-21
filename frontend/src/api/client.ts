import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// A request that's already been retried once carries this flag, so a
// second 401 on the same request fails through instead of looping.
type RetriableConfig = InternalAxiosRequestConfig & {
  _retried?: boolean;
};

// Concurrent requests that all 401 around the same time should share
// a single in-flight refresh call rather than each firing their own
// (which would race to rotate the refresh token and invalidate one
// another). Plain axios.post is used here, not the `api` instance —
// going through `api` would re-enter this same response interceptor.
let refreshInFlight: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(`${baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return accessToken;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

function forceLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // client.ts sits outside the React tree, so there's no router
  // context to navigate with here — a hard redirect is the reliable
  // way to land back on /login from an interceptor.
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login")
      || originalRequest?.url?.includes("/auth/register")
      || originalRequest?.url?.includes("/auth/refresh");

    if (!isUnauthorized || !originalRequest || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (originalRequest._retried) {
      // Already tried refreshing once for this request and still
      // got a 401 — the session is genuinely gone.
      forceLogout();
      return Promise.reject(error);
    }

    originalRequest._retried = true;

    try {
      const newAccessToken = await refreshAccessToken();

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch {
      forceLogout();
      return Promise.reject(error);
    }
  }
);