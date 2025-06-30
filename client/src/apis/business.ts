import { AxiosError } from "axios";
import api from "./api";
import { TBusinessSchema } from "@/app/(protected)/setup/page";
import { TUpdateBusinessSchema } from "@/app/(protected)/business/business-form";
import { TPasswordSchema } from "@/app/(protected)/business/password-form";

export const getBusiness = async () => {
  try {
    const response = await api.get("/business");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
};

export const createBusiness = async (data: TBusinessSchema) => {
  try {
    const response = await api.post("/business", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
};

export const updateBusiness = async (data: TUpdateBusinessSchema) => {
  try {
    const response = await api.patch("/business", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
};

export const changeBusinessPassword = async (data: TPasswordSchema) => {
  try {
    const response = await api.patch("/business/password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
};
