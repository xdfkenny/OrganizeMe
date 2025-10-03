'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
           {children}
        </div>
      </main>
    </div>
  );
}
