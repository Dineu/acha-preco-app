import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockShoppingLists } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Minhas Listas de Compras</h1>
        <p className="text-muted-foreground">Crie e gerencie suas listas de compras aqui.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockShoppingLists.map((list) => {
          const totalItems = list.items.length;
          const completedItems = list.items.filter((item) => item.checked).length;
          const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
          const lastUpdated = format(parseISO(list.updatedAt), "dd 'de' MMMM, yyyy", { locale: ptBR });

          return (
            <Link href={`/dashboard/lists/${list.id}`} key={list.id}>
              <Card className="hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="font-headline">{list.name}</CardTitle>
                  <CardDescription>Atualizada em {lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progresso</span>
                    <span>{completedItems} / {totalItems}</span>
                  </div>
                  <Progress value={progress} aria-label={`${progress.toFixed(0)}% completo`} />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
