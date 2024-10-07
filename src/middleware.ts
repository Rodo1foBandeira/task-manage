import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// the following code is taken from : https://nextjs.org/docs/advanced-features/middleware#setting-headers
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  let pathname = request.nextUrl.href.split("?")[0];
  pathname = pathname.substring(pathname.indexOf("://") + 3);
  pathname = pathname.substring(pathname.indexOf("/"));
  requestHeaders.set("pathname", pathname);
  requestHeaders.set("searchParams", request.nextUrl.href.split("?")[1]);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
