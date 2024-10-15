import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/tarefas", "/api/utils"];

export async function middleware(req: NextRequest) {
  // Obter o token JWT de sessão
  const token = await getToken({ req });

  // Verificar se o caminho atual é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    // Se não estiver logado, redireciona para a página de login
    const loginUrl = new URL("/api/auth/signin/google", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url); // Preserva a URL original para redirecionar após o login
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(req.headers);
  const url = new URL(req.url);
  requestHeaders.set("searchParams", url.searchParams.toString());

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
