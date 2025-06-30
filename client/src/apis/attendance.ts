import { AxiosError } from "axios";
import api from "./api";

export async function checkIn(token: string) {
  try {
    const response = await api.post("/attendance/check-in", {
      token: token,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function checkOut(token: string) {
  try {
    const response = await api.post("/attendance/check-out", {
      token: token,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function getAttendanceLogs() {
  try {
    const response = await api.get("/attendance/logs");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
