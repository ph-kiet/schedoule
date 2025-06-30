import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/sign-in"];

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId");
  const pathname = request.nextUrl.pathname;

  if (authRoutes.includes(pathname)) {
    if (sessionId) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
          {
            headers: {
              Cookie: `sessionId=${sessionId.value}`,
            },
          }
        );
        if (response.ok) {
          return NextResponse.redirect(new URL("/", request.url));
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
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
