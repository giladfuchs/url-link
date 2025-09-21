import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { API_URL } from "@/lib/config";

import type { FieldValue, ModelType } from "@/lib/types";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (cfg: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    cfg.headers = cfg.headers ?? new AxiosHeaders();
    if (token) {
      cfg.headers.set("Authorization", `Bearer ${token}`);
    }
    return cfg;
  },
  (error) => Promise.reject(error),
);

export function forceLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("token_expires_at");
  document.cookie = "auth_token=false; Max-Age=0; Path=/; SameSite=Lax";
  toast.error("Session expired");
  window.location.href = "/";
}

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401) {
      forceLogout();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export const createOrUpdateRow = async (opts: {
  model: ModelType;
  id: number | string;
  data: Record<string, FieldValue>;
}) => {
  const { model, id, data } = opts;
  const res = await API.post(`/${model}/${id}`, data);
  return res.data;
};

export default API;
