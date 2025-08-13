
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };
  
  return (
    <div className="flex flex-col gap-4">
       <header>
        <h1 className="text-2xl font-bold tracking-tight font-headline">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações pessoais.</p>
      </header>
       <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>Estes são os seus detalhes de usuário.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold">{user.displayName}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : (
            <p>Não foi possível carregar as informações do usuário.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

