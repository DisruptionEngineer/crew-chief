import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // We need to set cookies on the response, handled below
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const response = NextResponse.redirect(new URL(next, request.url))
      // Forward any cookies set by Supabase
      const allCookies = request.cookies.getAll()
      for (const cookie of allCookies) {
        response.cookies.set(cookie.name, cookie.value)
      }
      return response
    }
  }

  // If code exchange fails, redirect to sign-in with error
  return NextResponse.redirect(new URL('/sign-in?error=confirmation_failed', request.url))
}
