'use client';

import { useState } from 'react';
import { Calendar, CheckSquare, Feather } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import TaskListView from '@/components/task-list-view';
import CalendarView from '@/components/calendar-view';
import { Separator } from '@/components/ui/separator';

type View = 'tasks' | 'calendar';

export default function AppLayout() {
  const [view, setView] = useState<View>('tasks');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <a href="#" className="flex items-center space-x-2">
              <Feather className="h-6 w-6 text-primary" />
              <span className="inline-block font-bold font-headline">OrganizeMe</span>
            </a>
            <nav className="hidden md:flex gap-6">
              <Button variant={view === 'tasks' ? 'link' : 'ghost'} className="text-sm font-medium" onClick={() => setView('tasks')}>
                <CheckSquare className='mr-2 h-4 w-4' />
                Tasks
              </Button>
              <Button variant={view === 'calendar' ? 'link' : 'ghost'} className="text-sm font-medium text-muted-foreground" onClick={() => setView('calendar')}>
                <Calendar className='mr-2 h-4 w-4' />
                Calendar
              </Button>
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
           {view === 'tasks' && <TaskListView />}
           {view === 'calendar' && <CalendarView />}
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
            <Button variant={view === 'tasks' ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setView('tasks')}>
              <CheckSquare className='h-5 w-5' />
              <span className="sr-only">Tasks</span>
            </Button>
            <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setView('calendar')}>
              <Calendar className='h-5 w-5' />
               <span className="sr-only">Calendar</span>
            </Button>
          </nav>
        </div>
    </div>
  );
}
