'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookMarked, Info, LogOut, LayoutDashboard } from 'lucide-react';
import { signout } from '@/app/login/actions';

interface ProfileMenuProps {
  email: string;
}

export function ProfileMenu({ email }: ProfileMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const initials = email.substring(0, 2).toUpperCase();

  const handleOpenHistory = () => {
    window.location.href = '/dashboard';
    setIsDropdownOpen(false);
  };

  const handleOpenAbout = () => {
    setIsAboutOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    startTransition(() => {
      signout();
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility for the dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        return;
      }

      const menuItems = dropdownRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]'
      );
      if (!menuItems || menuItems.length === 0) return;

      const currentIndex = Array.from(menuItems).findIndex(
        (item) => item === document.activeElement
      );

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
        menuItems[nextIndex].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
        menuItems[prevIndex].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          className="relative h-10 w-10 rounded-full bg-surface-container border border-outline hover:bg-surface-high transition-all flex items-center justify-center outline-none"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-transparent text-on-surface font-medium">{initials}</AvatarFallback>
          </Avatar>
        </button>

        {isDropdownOpen && (
          <div role="menu" className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background ring-1 ring-outline z-50 text-on-surface overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-2 border-b border-outline">
              <p className="text-sm font-medium text-on-surface">My Account</p>
              <p className="text-xs text-muted-foreground truncate mt-1">{email}</p>
            </div>
            
            <div className="py-1">
              <button role="menuitem" onClick={() => { window.location.href = '/dashboard'; setIsDropdownOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-high focus:bg-surface-high focus:outline-none flex items-center transition-colors">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </button>
              <button role="menuitem" onClick={handleOpenHistory} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-high focus:bg-surface-high focus:outline-none flex items-center transition-colors">
                <BookMarked className="mr-2 h-4 w-4" />
                <span>My Roadmaps</span>
              </button>
              <button role="menuitem" onClick={handleOpenAbout} className="w-full text-left px-3 py-2 text-sm hover:bg-surface-high focus:bg-surface-high focus:outline-none flex items-center transition-colors">
                <Info className="mr-2 h-4 w-4" />
                <span>About EduSetu</span>
              </button>
            </div>
            
            <div className="border-t border-outline py-1">
              <button 
                role="menuitem"
                onClick={handleSignOut} 
                disabled={isPending}
                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error-container focus:bg-error-container focus:outline-none flex items-center transition-colors disabled:opacity-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <DialogContent className="bg-background border-outline text-on-surface sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">About EduSetu</DialogTitle>
            <DialogDescription className="text-on-surface-variant">
              Your AI-driven navigator for mastering any skill.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-on-surface">Why EduSetu?</h4>
              <p className="text-sm text-on-surface-variant">EduSetu was built to solve the overwhelm of learning. By breaking down complex topics into clear, actionable roadmaps, it gives you the exact steps needed to reach your goal.</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-on-surface">Creator</h4>
              <p className="text-sm text-on-surface-variant">A personal mission to make learning less overwhelming, built by a student who felt it firsthand.</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-on-surface">Connect</h4>
              <p className="text-sm text-on-surface-variant">
                Portfolio &rarr; <a href="https://krrish-portfolio-six.vercel.app/" target="_blank" className="text-primary hover:underline">https://krrish-portfolio-six.vercel.app/</a>
              </p>
              <p className="text-sm text-on-surface-variant">
                Email &rarr; <a href="mailto:dewangankrrish50@gmail.com" className="text-primary hover:underline">dewangankrrish50@gmail.com</a>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
