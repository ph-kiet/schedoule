"use server";
import { TSignInSchema } from "@/schemas/authSchema";
import { cookies } from "next/headers";
import api from "./api";
import { AxiosError } from "axios";

export async function signIn(data: TSignInSchema) {
  const cookieStore = await cookies();
  try {
    const response = await api.post("/auth/qr/sign-in", data);
    cookieStore.set("sessionId", response.data.sessionId, {
      httpOnly: true,
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 90, // 3 months
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      sameSite: "none",
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) return error.response?.data;
  }
}
