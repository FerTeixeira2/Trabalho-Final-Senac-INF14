import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/LoginForm';
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm';
import { Dashboard } from '@/components/Dashboard';

type AuthView = 'login' | 'forgot-password';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary/5 via-transparent to-transparent" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/5 via-transparent to-transparent" />
      </div>

      {/* Auth Forms */}
      <div className="relative z-10">
        {authView === 'login' ? (
          <LoginForm onForgotPassword={() => setAuthView('forgot-password')} />
        ) : (
          <ForgotPasswordForm onBack={() => setAuthView('login')} />
        )}
      </div>
    </div>
  );
};

export default Index;
