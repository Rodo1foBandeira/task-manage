import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/tarefa", "/api/utils"];

export async function middleware(req: NextRequest) {
  // Obter o token JWT de sessão
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Verificar se o caminho atual é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Se não estiver logado, redireciona para a página de login
    const loginUrl = new URL("/api/auth/signin/google", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url); // Preserva a URL original para redirecionar após o login
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  let pathname = req.nextUrl.href.split("?")[0];
  pathname = pathname.substring(pathname.indexOf("://") + 3);
  pathname = pathname.substring(pathname.indexOf("/"));
  requestHeaders.set("pathname", pathname);
  requestHeaders.set("searchParams", req.nextUrl.href.split("?")[1]);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
