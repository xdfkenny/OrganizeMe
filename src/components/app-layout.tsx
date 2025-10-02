'use client';

import { useState } from 'react';
import { Calendar, CheckSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import TaskListView from '@/components/task-list-view';
import CalendarView from '@/components/calendar-view';

type View = 'tasks' | 'calendar';

export default function AppLayout() {
  const [view, setView] = useState<View>('tasks');

  return (
    <div className="flex min-h-screen w-full flex-col">
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
