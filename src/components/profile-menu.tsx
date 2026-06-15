'use client';

import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookMarked, Info, LogOut } from 'lucide-react';
import { signout } from '@/app/login/actions';

interface ProfileMenuProps {
  email: string;
}

export function ProfileMenu({ email }: ProfileMenuProps) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const initials = email.substring(0, 2).toUpperCase();

  const handleOpenHistory = () => {
    document.dispatchEvent(new CustomEvent('open-history'));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="relative h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.1] transition-all flex items-center justify-center cursor-pointer outline-none">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-transparent text-white font-medium">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-[#0a0a0a] border-white/[0.1] text-white/90" align="end">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1 text-sm">
              <p className="text-sm font-medium leading-none text-white">My Account</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.05]" onClick={handleOpenHistory}>
            <BookMarked className="mr-2 h-4 w-4" />
            <span>My Roadmaps</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-white/[0.05]" onClick={() => setIsAboutOpen(true)}>
            <Info className="mr-2 h-4 w-4" />
            <span>About EduSetu</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 focus:text-red-400" onClick={() => signout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/[0.1] text-white/90 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">About EduSetu</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Your AI-driven navigator for mastering any skill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white">Why EduSetu?</h4>
              <p className="text-sm text-zinc-400">EduSetu was built to solve the overwhelm of learning. By breaking down complex topics into clear, actionable roadmaps, it gives you the exact steps needed to reach your goal.</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white">Creator</h4>
              <p className="text-sm text-zinc-400">A personal mission to make learning less overwhelming, built by a student who felt it firsthand.</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white">Connect</h4>
              <p className="text-sm text-zinc-400">
                Portfolio &rarr; <a href="https://krrish-portfolio-six.vercel.app/" target="_blank" className="text-blue-400 hover:underline">https://krrish-portfolio-six.vercel.app/</a>
              </p>
              <p className="text-sm text-zinc-400">
                Email &rarr; <a href="mailto:dewangankrrish50@gmail.com" className="text-blue-400 hover:underline">dewangankrrish50@gmail.com</a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
