
import { type NextRequest, NextResponse } from 'next/server';

const DASHBOARD_PATH = '/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Se o usuário está tentando acessar o dashboard ou qualquer sub-página
  if (pathname.startsWith(DASHBOARD_PATH)) {
    // Verifica se o cookie de sessão do Firebase existe.
    // Este é um exemplo simples. Em produção, seria ideal usar um token mais seguro.
    const sessionCookie = request.cookies.get('firebase-auth-cookie'); // O nome do cookie pode variar

    if (!sessionCookie) {
      // Se não houver cookie, redireciona para a página de login.
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Permite que a requisição continue se as condições não forem atendidas
  return NextResponse.next();
}

// Define em quais rotas o middleware deve ser executado.
export const config = {
  matcher: ['/dashboard/:path*'],
};
