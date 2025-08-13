'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Map, PlusCircle, FlaskConical } from 'lucide-react';
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('Compras da Semana');
  const { toast } = useToast();
  const router = useRouter();


  const menuItems = [
    { href: '/dashboard', label: 'Minhas Listas', icon: Home },
    { href: '/dashboard/map', label: 'Mapa de Mercados', icon: Map },
    { href: '/dashboard/test-ai', label: 'Testar IA', icon: FlaskConical },
  ];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to create the list
    console.log('Creating new list:', newListName);

    toast({
      title: 'Lista Criada!',
      description: `A lista "${newListName}" foi criada com sucesso.`,
    });

    // We can simulate navigating to the new list in the future
    // For now, just close the dialog and refresh the dashboard
    setIsNewListDialogOpen(false);
    // router.push('/dashboard'); // Or navigate to the new list page
  };


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-semibold font-headline">Acha Preço</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger className="sm:hidden" />
          <div className="flex flex-1 items-center justify-end gap-2">
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
            <UserNav />
          </div>
        </header>
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
