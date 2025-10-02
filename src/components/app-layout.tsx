'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1">
        <div className="container py-8">
           {children}
        </div>
      </main>
       <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by your friendly AI assistant.
          </p>
        </div>
      </footer>

       {/* Mobile Nav */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background p-2">
          <nav className="flex justify-around">
            <Button asChild variant={pathname.startsWith('/todo') ? 'secondary' : 'ghost'} size="sm" className="flex-1">
              <Link href="/todo">
                <CheckSquare className='h-5 w-5' />
                <span className="sr-only">Tasks</span>
              </Link>
            </Button>
            <Button asChild variant={pathname.startsWith('/calendar') ? 'secondary' : 'ghost'} size="sm" className="flex-1">
              <Link href="/calendar">
                <Calendar className='h-5 w-5' />
                <span className="sr-only">Calendar</span>
              </Link>
            </Button>
          </nav>
        </div>
    </div>
  );
}
