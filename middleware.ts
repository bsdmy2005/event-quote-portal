import { withClerkMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default withClerkMiddleware((req) => {
  const { pathname } = req.nextUrl;
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/agencies",
    "/suppliers", 
    "/sign-in",
    "/sign-up",
    "/onboard",
    "/invite",
    "/dashboard",
    "/api/webhooks/clerk",
    "/api/public",
    "/app/data/templates",
    "/api/inboundemail",
    "/api/test",
    "/dashboard/documents"
  ];
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + "/")
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // For protected routes, let Clerk handle authentication
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};