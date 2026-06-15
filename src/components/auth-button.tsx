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
    <Link href="/login">
      <Button className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/90 active:scale-[0.98] transition-all" size="sm">
        Log In
      </Button>
    </Link>
  );
}
