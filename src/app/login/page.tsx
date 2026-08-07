'use client';

import { useState } from 'react';
import { login, signup } from './actions';
import { createClient } from '@/utils/supabase/client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to initialize Google login.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, action: typeof login) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formElement = (e.currentTarget as unknown as HTMLElement).closest('form');
    if (!formElement) return;
    
    const formData = new FormData(formElement);
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 sm:p-12 rounded-3xl bg-[hsl(var(--bg-glass)/0.6)] backdrop-blur-2xl border border-[hsl(var(--stroke-default))] shadow-card">
        <CardHeader className="p-0 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight text-[hsl(var(--text-primary))] text-center mb-2">Welcome back</CardTitle>
          <CardDescription className="text-sm text-[hsl(var(--text-secondary))] text-center mb-8">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form id="auth-form" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[hsl(var(--text-secondary))]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[hsl(var(--text-secondary))]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-[hsl(var(--danger))] bg-[hsl(var(--danger)/0.1)] p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <Button
                type="submit"
                className="w-full h-12 text-white font-medium rounded-xl transition-all active:scale-[0.98] shadow-glow-sm"
                style={{ background: 'var(--grad-btn)' }}
                disabled={isLoading}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, login)}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                className="w-full h-12 bg-transparent border border-[hsl(var(--stroke-default))] text-[hsl(var(--text-primary))] rounded-xl hover:bg-[hsl(var(--bg-elevated))] transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>, signup)}
              >
                Create Account
              </Button>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[hsl(var(--stroke-default))]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-background px-3 text-[hsl(var(--text-muted))]">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            className="w-full h-12 bg-transparent border border-[hsl(var(--stroke-default))] text-[hsl(var(--text-primary))] rounded-xl hover:bg-[hsl(var(--bg-elevated))] transition-all flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
