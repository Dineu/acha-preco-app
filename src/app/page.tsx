'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro de Login',
        description: 'Credenciais inválidas. Por favor, tente novamente.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro de Login com Google',
        description: 'Não foi possível fazer login com o Google. Tente novamente.',
      });
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-headline">Bem-vindo(a)!</CardTitle>
          <CardDescription>
            Entre com seu e-mail e senha para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isLoading || isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="animate-spin" /> : 'Entrar com Google'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
