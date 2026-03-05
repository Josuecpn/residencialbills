import axios, { AxiosError } from "axios";

export function setupAPIClient(ctx: object | undefined = undefined) {

  const api = axios.create({
    baseURL: "https://localhost:7246/api",
  });

  api.interceptors.response.use(
    (response: any) => {
      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return api;
}