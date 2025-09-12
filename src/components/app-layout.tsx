'use client';

import { useState } from 'react';
import { Calendar, CheckSquare, Feather } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/user-nav';
import TaskListView from '@/components/task-list-view';
import CalendarView from '@/components/calendar-view';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type View = 'tasks' | 'calendar';

export default function AppLayout() {
  const [view, setView] = useState<View>('tasks');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300',
            isSidebarCollapsed ? 'w-14' : 'w-56'
          )}
        >
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <div
              className={cn(
                'flex h-12 w-full items-center justify-center gap-2 rounded-lg text-primary',
                isSidebarCollapsed ? '' : 'px-3'
              )}
            >
              <Feather className="h-6 w-6" />
              <span
                className={cn(
                  'font-headline text-lg font-bold',
                  isSidebarCollapsed && 'sr-only'
                )}
              >
                OrganizeMe
              </span>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === 'tasks' ? 'secondary' : 'ghost'}
                  size="icon"
                  className={cn('rounded-lg', !isSidebarCollapsed && 'w-full justify-start gap-2 px-3')}
                  onClick={() => setView('tasks')}
                >
                  <CheckSquare className="h-5 w-5" />
                  <span className={cn(isSidebarCollapsed && 'sr-only')}>Tasks</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tasks</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === 'calendar' ? 'secondary' : 'ghost'}
                  size="icon"
                  className={cn('rounded-lg', !isSidebarCollapsed && 'w-full justify-start gap-2 px-3')}
                  onClick={() => setView('calendar')}
                >
                  <Calendar className="h-5 w-5" />
                  <span className={cn(isSidebarCollapsed && 'sr-only')}>Calendar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Calendar</TooltipContent>
            </Tooltip>
          </nav>
           <div className="mt-auto p-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            >
               <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("h-5 w-5 transition-transform", isSidebarCollapsed && "rotate-180")}
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </aside>
        <div
          className={cn(
            'flex flex-col sm:gap-4 sm:py-4 transition-all duration-300',
            isSidebarCollapsed ? 'sm:pl-14' : 'sm:pl-56'
          )}
        >
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <div className='sm:hidden'>
               <Feather className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-auto flex items-center gap-4">
              <UserNav />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {view === 'tasks' && <TaskListView />}
            {view === 'calendar' && <CalendarView />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
