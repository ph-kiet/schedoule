import { IEmployee } from "@/types/interfaces";
import api from "./api";
import { AxiosError } from "axios";
import { TAddEmployeeSchema } from "@/schemas/employeeSchema";

export async function getEmployees(): Promise<IEmployee[]> {
  try {
    const response = await api.get("/employee");
    return response.data as IEmployee[];
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
    return [];
  }
}

export async function createEmployee(data: TAddEmployeeSchema) {
  try {
    const response = await api.post("/employee", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function updateEmployeeDetails(
  employeeId: string,
  data: TAddEmployeeSchema
) {
  try {
    const response = await api.patch(`/employee/${employeeId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function removeEmployee(employeeId: string) {
  try {
    const response = await api.delete(`/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
