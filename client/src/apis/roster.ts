import { TRosterSchema } from "@/schemas/rosterSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function getRoster(startDate: Date, endDate: Date) {
  try {
    const response = await api.get("/roster", {
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

export async function createRoster(data: TRosterSchema) {
  try {
    const response = await api.post("/roster", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function updateRoster(rosterId: string, data: TRosterSchema) {
  try {
    const response = await api.patch(`/roster/${rosterId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function dndUpdateRoster(
  rosterId: string,
  startDate: Date,
  endDate: Date
) {
  try {
    const response = await api.patch(`/roster/${rosterId}`, {
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function deleteRoster(rosterId: string) {
  try {
    const response = await api.delete(`/roster/${rosterId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function getUpcomingShifts() {
  try {
    const response = await api.get("/roster/upcoming");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
