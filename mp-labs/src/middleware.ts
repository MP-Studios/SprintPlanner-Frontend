import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Protect ALL routes EXCEPT public pages
    '/((?!_next/static|_next/image|favicon.ico|login|signup|$).*)',
  ],
};
