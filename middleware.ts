import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only handle our custom API routes (not Payload routes)
  const isCustomAPI = 
    request.nextUrl.pathname.startsWith('/api/') &&
    !request.nextUrl.pathname.startsWith('/api/payload') &&
    !request.nextUrl.pathname.startsWith('/api/graphql')

  if (!isCustomAPI) {
    return NextResponse.next()
  }

  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 })
    
    // Set CORS headers for preflight
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.set('Access-Control-Max-Age', '86400')
    
    return response
  }

  // For actual requests, continue processing and add CORS headers
  const response = NextResponse.next()
  
  // Set CORS headers for actual responses
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  
  return response
}

export const config = {
  matcher: [
    // Match all API routes except Payload and GraphQL
    '/api/((?!payload|graphql).*)',
  ],
}
