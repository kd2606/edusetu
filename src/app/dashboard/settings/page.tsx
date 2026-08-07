'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function SettingsPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });
  }, [supabase.auth]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">Account Settings</h1>
        <p className="text-on-surface-variant mt-2">Manage your profile and preferences.</p>
      </div>

      <Card className="border-outline-variant shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <CardTitle>Profile Information</CardTitle>
          </div>
          <CardDescription>Your personal account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-on-surface-variant">Email Address</label>
            <div className="mt-1 p-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface">
              {user?.email || 'No email found'}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-on-surface-variant">Account ID</label>
            <div className="mt-1 p-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface font-mono text-xs">
              {user?.id}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-on-surface-variant">Joined</label>
            <div className="mt-1 p-3 bg-surface-container rounded-lg border border-outline-variant text-on-surface text-sm">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown'}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-error/20 shadow-sm bg-error/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error" />
            <CardTitle className="text-error">Danger Zone</CardTitle>
          </div>
          <CardDescription>Actions here cannot be undone easily.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-start">
          <Button 
            variant="outline" 
            className="text-error border-error/50 hover:bg-error/10 hover:text-error"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Sign Out of EduSetu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
