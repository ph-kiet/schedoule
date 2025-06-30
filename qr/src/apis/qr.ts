import { AxiosError } from "axios";
import api from "./api";

export async function getQRCode() {
  try {
    const response = await api.get("/qr-code");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
