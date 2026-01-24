import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Monitor, LogOut, User, Shield } from 'lucide-react';

export function Header() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
            <Monitor className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              Controle de Ativos
            </h1>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Sistema de Gestão de TI
            </p>
          </div>
        </div>

        {/* User info and logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary">
              {isAdmin ? (
                <Shield className="w-4 h-4 text-primary" />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrador' : 'Usuário'}
              </p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
