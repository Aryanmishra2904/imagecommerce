import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;

      // Allow public routes
      if (
        pathname.startsWith("/api/webhook") ||
        pathname.startsWith("/api/auth") ||
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/" ||
        pathname.startsWith("/api/products") ||
        pathname.startsWith("/products")
      ) {
        return true;
      }

      // Admin routes
      if (pathname.startsWith("/admin")) {
        return token?.role === "admin";
      }

      // All other routes require authentication
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
