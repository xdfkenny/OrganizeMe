'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/app-context';
import { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function CalendarView() {
  const { tasks, isInitialized } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const tasksWithDueDates = useMemo(() => {
    return tasks.filter((task) => !!task.dueDate);
  }, [tasks]);

  const selectedDayTasks = useMemo(() => {
    if (!selectedDate) return [];
    const formattedSelectedDate = format(selectedDate, 'yyyy-MM-dd');
    return tasksWithDueDates
      .filter((task) => format(new Date(task.dueDate!), 'yyyy-MM-dd') === formattedSelectedDate)
      .sort((a,b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1);
  }, [selectedDate, tasksWithDueDates]);

  if (!isInitialized) {
    return <div>Loading calendar...</div>
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <Card className="flex-grow lg:flex-grow-[2] xl:flex-grow-[3]">
        <CardContent className="p-0 sm:p-4 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md w-full"
              classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4 w-full',
                table: 'w-full border-collapse',
                head_row: 'flex justify-between',
                head_cell: 'text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center',
                row: 'flex w-full mt-2 justify-between',
                cell: 'text-center text-sm p-0 relative aspect-square flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: 'h-full w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center',
                day_selected:'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside: 'text-muted-foreground opacity-50',
                day_disabled:'text-muted-foreground opacity-50',
                day_hidden: 'invisible',
              }}
              modifiers={{
                hasTask: tasksWithDueDates.map((task) => new Date(task.dueDate!)),
              }}
              modifiersStyles={{
                hasTask: {
                  position: 'relative',
                },
              }}
              components={{
                DayContent: (props) => {
                  const { date, activeModifiers } = props;
                  const originalDay = <div className='relative'>{format(date, 'd')}</div>;
                  if (activeModifiers.hasTask) {
                    return (
                      <div className='relative'>
                        {originalDay}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                    );
                  }
                  return originalDay;
                },
              }}
            />
        </CardContent>
      </Card>

      <div className="flex-grow lg:flex-grow-[1]">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDayTasks.length > 0 ? (
              selectedDayTasks.map((task: Task) => (
                <div key={task.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                  <p className={cn("font-semibold", task.completed && 'line-through text-muted-foreground')}>
                    {task.title}
                  </p>
                  {task.category && (
                    <Badge variant="secondary" className="mt-1 flex items-center gap-2 w-fit">
                       <span className={cn('h-2 w-2 rounded-full', task.category.color)}></span>
                       {task.category.name}
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">No tasks due on this day.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
