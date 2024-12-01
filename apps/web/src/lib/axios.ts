import Axios, { AxiosInstance } from "axios";

export class AxiosManager {
  public readonly axios: AxiosInstance;

  constructor() {
    this.axios = Axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
      withCredentials: true,
    });
  }
}

export const { axios } = new AxiosManager();
