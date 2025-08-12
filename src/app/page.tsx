'use client';

import { useEffect, useState } from 'react';
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

  // Redirect to dashboard immediately on mount to bypass login for development
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);
  
  // The original login logic is kept below but will not be used due to the redirect.
  // This makes it easy to re-enable login later.

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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
       <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin" />
        <p className="mt-4 text-muted-foreground">Redirecionando para o painel...</p>
      </div>
    </div>
  );
}
