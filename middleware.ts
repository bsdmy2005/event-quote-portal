import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  // Array of public routes that don't require authentication
  publicRoutes: [
    "/",
    "/agencies",
    "/suppliers", 
    "/sign-in",
    "/sign-up",
    "/redirect",
    "/onboard(.*)",
    "/invite",
    "/api/webhooks/clerk",
    "/api/public",
    "/app/data/templates",
    "/api/inboundemail",
    "/api/test",
    "/api/test-email",
    "/api/test-postmark",
    "/api/debug-postmark",
    "/api/test-postmark-direct",
    "/api/test-postmark-exact",
    "/api/check-server",
    "/api/test-template",
    "/api/list-templates",
    "/api/test-simple",
    "/api/test-blackhole",
    "/api/webhooks/postmark",
  ],
  // Array of routes that can be accessed by authenticated users
  ignoredRoutes: ["/api/webhook", "/api/public"],
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};