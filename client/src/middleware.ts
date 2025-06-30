import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "./apis/api";

const authRoutes = ["/sign-in", "/sign-up", "/employee/sign-in"];
const userRoleRoutes = ["/employees", "/business", "/setup"];

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId");
  const pathname = request.nextUrl.pathname;

  // Check session
  if (authRoutes.includes(pathname)) {
    if (sessionId) {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Cookie: `sessionId=${sessionId.value}`,
          },
        });

        if (response.data.ok) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
          // If session is invalid, clear it and stay on auth page
          const response = NextResponse.next();
          response.cookies.delete("sessionId");
          return response;
        }
      } catch (error) {
        console.log(error);
        // If check fails, clear session and stay on auth page
        const response = NextResponse.next();
        response.cookies.delete("sessionId");
        return response;
      }
    }
  }

  // Check role
  if (userRoleRoutes.includes(pathname)) {
    if (sessionId) {
      try {
        const response = await api.get("/auth/me", {
          headers: {
            Cookie: `sessionId=${sessionId.value}`,
          },
        });

        const { user } = response.data;
        if (user.role !== "user") {
          return NextResponse.redirect(new URL("/not-found", request.url));
        }
      } catch (error) {
        console.log(error);
        const response = NextResponse.next();
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
