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
        <Button className="bg-transparent hover:bg-white/[0.04] text-white/80 hover:text-white transition-all" size="sm" variant="ghost">
          Log In
        </Button>
      </Link>
      <Link href="/login">
        <Button className="bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all font-medium" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
