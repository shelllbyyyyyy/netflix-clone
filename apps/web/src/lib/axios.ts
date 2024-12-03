/* eslint-disable react-hooks/rules-of-hooks */
import { useUserStore } from "@/components/features/user/hook/useUserStore";
import { useGetCookies } from "@/hook/useCookie";
import Axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

export class AxiosManager {
  public readonly axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
      withCredentials: true,
    });

    this.axios.interceptors.request.use(
      this.authRequestInterceptor.bind(this),
      (error) => Promise.reject(error)
    );
    this.axios.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this)
    );
  }

  private async authRequestInterceptor(
    axiosConfig: InternalAxiosRequestConfig
  ) {
    const store = useUserStore.getState();
    const token = store.user?.access_token;

    if (axiosConfig.headers) {
      if (token) {
        axiosConfig.headers.authorization = `Bearer ${token}`;
      }
      axiosConfig.headers.Accept = "application/json";
    }

    return axiosConfig;
  }

  private async handleResponseError(error: any) {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await useGetCookies();

        if (!refreshToken) throw new Error("Error");

        const response = await this.axios.get("api/auth/refresh", {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = response.data.data.access_token;

        useUserStore
          .getState()
          .setCredentials({ access_token: newAccessToken });

        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        return this.axios(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().removeCredentials();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
}

export const { axios } = new AxiosManager();
