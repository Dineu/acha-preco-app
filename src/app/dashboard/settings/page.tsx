
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
       <header>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Configurações</h1>
        <p className="text-muted-foreground">Ajuste as preferências do aplicativo.</p>
      </header>
       <Card>
        <CardHeader>
            <CardTitle>Em Construção</CardTitle>
            <CardDescription>Esta área estará disponível em breve.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-muted-foreground text-center p-8 border-2 border-dashed rounded-lg">
                <Construction className="h-12 w-12 mb-4" />
                <p>Estamos trabalhando para trazer novas funcionalidades para você.</p>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
