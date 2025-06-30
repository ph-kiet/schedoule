"use server";
import { cookies } from "next/headers";

import {
  TEmployeeSignInSchema,
  TSignInSchema,
  TSignUpSchema,
} from "@/schemas/authSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function signUp(data: TSignUpSchema) {
  try {
    const response = await api.post("/auth/sign-up", data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function signIn(data: TSignInSchema) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/auth/sign-in", data);
    cookieStore.set("sessionId", response.data.sessionId, {
      httpOnly: true,
      path: "/",
      secure: true,
      maxAge: 3600,
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      sameSite: "none",
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}

export async function employeeSignIn(data: TEmployeeSignInSchema) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/auth/employee/sign-in", data);
    cookieStore.set("sessionId", response.data.sessionId, {
      httpOnly: true,
      path: "/",
      secure: true,
      maxAge: 3600,
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      sameSite: "none",
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
