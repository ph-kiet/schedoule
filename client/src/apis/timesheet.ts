import { AxiosError } from "axios";
import api from "./api";

export async function getTimesheet(
  role: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const endpoint = role === "user" ? "/timesheet/business" : "/timesheet";
    const response = await api.get(endpoint, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
