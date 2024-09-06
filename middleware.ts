
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes (including '/api/uploadthing')
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/api/uploadthing']);

export default clerkMiddleware((auth, request) => {
  // Check if the route is public
  if (!isPublicRoute(request)) {
    auth().protect();
  }
  // You can also add additional logic here if needed
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
