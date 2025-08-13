
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, PlusCircle, FlaskConical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';


/**
 * @fileoverview Este é o layout principal para todas as páginas do dashboard.
 * Ele fornece a estrutura de navegação persistente, como a barra lateral e o cabeçalho.
 * O conteúdo de cada página específica do dashboard é renderizado através do {children}.
 * Ele também protege as rotas, redirecionando usuários não logados para a página de login.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para controlar a abertura do diálogo de criação de nova lista.
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  // Estado para armazenar o nome da nova lista.
  const [newListName, setNewListName] = useState('Compras da Semana');


  // Definição dos itens do menu da barra lateral.
  const menuItems = [
    { href: '/dashboard', label: 'Minhas Listas', icon: Home },
    { href: '/dashboard/map', label: 'Mapa de Mercados', icon: Map },
    { href: '/dashboard/test-ai', label: 'Testar IA', icon: FlaskConical },
  ];

  /**
   * Efeito para verificar o estado de autenticação do usuário.
   * Se o usuário não estiver logado, ele é redirecionado para a página de login.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Se não houver usuário, redireciona para a página de login.
        router.push('/');
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });

    // Limpa o listener quando o componente é desmontado.
    return () => unsubscribe();
  }, [router]);


  /**
   * Manipula a submissão do formulário para criar uma nova lista.
   * Atualmente, apenas simula a criação e exibe uma notificação.
   * @param {React.FormEvent} e - O evento do formulário.
   */
  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    // Em um aplicativo real, aqui ocorreria uma chamada de API para salvar a lista no banco de dados.
    console.log('Criando nova lista:', newListName);

    toast({
      title: 'Lista Criada!',
      description: `A lista "${newListName}" foi criada com sucesso.`,
    });

    // Fecha o diálogo após a criação.
    setIsNewListDialogOpen(false);
    // Idealmente, o usuário seria redirecionado para a página da nova lista.
    // router.push('/dashboard/lists/new-list-id');
  };

  // Enquanto verifica a autenticação, exibe uma tela de carregamento.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    // O SidebarProvider gerencia o estado da barra lateral (aberta/fechada).
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold font-headline">Acha Preço</span>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Renderiza o menu de navegação. */}
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href} // Destaca o item ativo.
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* SidebarInset envolve o conteúdo principal da página. */}
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* O SidebarTrigger é o botão para abrir/fechar a sidebar em dispositivos móveis. */}
          <SidebarTrigger className="sm:hidden" />

          <div className="flex flex-1 items-center justify-end gap-2">
            {/* Diálogo para criar uma nova lista. */}
             <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Nova Lista
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreateList}>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Lista</DialogTitle>
                    <DialogDescription>
                      Dê um nome para sua nova lista de compras. Você poderá adicionar itens a seguir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nome
                      </Label>
                      <Input 
                        id="name" 
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="col-span-3"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Criar Lista</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Componente de navegação do usuário (avatar, menu de perfil). */}
            <UserNav />
          </div>
        </header>

        {/* O conteúdo da página atual é renderizado aqui. */}
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
