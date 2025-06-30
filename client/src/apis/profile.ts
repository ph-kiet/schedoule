import { AxiosError } from "axios";
import api from "./api";
import { TProfileSchema } from "@/app/(protected)/profile/employee-form";
import { TPasswordSchema } from "@/app/(protected)/profile/password-form";

export async function updateProfile(data: TProfileSchema) {
  try {
    const response = await api.post("/profile", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function changePassword(data: TPasswordSchema) {
  try {
    const response = await api.post("/profile/password", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
