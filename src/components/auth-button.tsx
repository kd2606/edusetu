import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { ProfileMenu } from '@/components/profile-menu';

export async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return <ProfileMenu email={user.email ?? ''} />;
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button className="bg-transparent hover:bg-surface-high text-on-surface-variant hover:text-on-surface transition-all" size="sm" variant="ghost">
          Log In
        </Button>
      </Link>
      <Link href="/login">
        <Button
          className="rounded-full h-9 px-5 text-white font-medium shadow-[0_1px_0_0_hsl(0_0%_100%/0.25)_inset] shadow-glow-sm hover:shadow-glow-md hover:-translate-y-px active:scale-[0.98] transition-all duration-150"
          style={{ background: 'var(--grad-btn)' }}
          size="sm"
        >
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
