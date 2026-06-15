import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { signout } from '@/app/login/actions';

export async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <form action={signout}>
          <Button className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/90 active:scale-[0.98] transition-all" size="sm">
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/90 active:scale-[0.98] transition-all" size="sm">
        Log In
      </Button>
    </Link>
  );
}
