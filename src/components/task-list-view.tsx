'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/contexts/app-context';
import TaskItem from '@/components/task-item';
import { AddEditTaskDialog } from '@/components/add-edit-task-dialog';
import { Task } from '@/lib/types';

export default function TaskListView() {
  const { tasks, isInitialized } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const groupedTasks = useMemo(() => {
    if (!isInitialized) return {};

    const groups: { [key: string]: Task[] } = {
      'No Category': [],
    };

    tasks.forEach((task) => {
      const categoryName = task.category?.name || 'No Category';
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(task);
    });

    // Sort tasks within each group (incomplete first, then by due date)
    for (const key in groups) {
      groups[key].sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return a.dueDate ? -1 : b.dueDate ? 1 : 0;
      });
    }

    // Sort categories: 'No Category' last, others alphabetically
    return Object.keys(groups)
      .sort((a, b) => {
        if (a === 'No Category') return 1;
        if (b === 'No Category') return -1;
        return a.localeCompare(b);
      })
      .reduce((acc, key) => {
        if(groups[key].length > 0) {
          acc[key] = groups[key];
        }
        return acc;
      }, {} as { [key: string]: Task[] });
  }, [tasks, isInitialized]);

  const getCategoryColor = (categoryName: string) => {
    const task = tasks.find(t => t.category?.name === categoryName);
    return task?.category?.color || 'bg-gray-400';
  }

  if (!isInitialized) {
    return <div>Loading tasks...</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Tasks</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      <div className="space-y-6">
        {Object.keys(groupedTasks).length > 0 ? (
          Object.entries(groupedTasks).map(([categoryName, tasksInCategory]) => (
            <Card key={categoryName}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${getCategoryColor(categoryName)}`}></span>
                  <CardTitle className="font-headline text-xl">{categoryName}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasksInCategory.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">All clear!</h2>
            <p className="text-muted-foreground">You have no tasks. Add one to get started.</p>
          </div>
        )}
      </div>
      <AddEditTaskDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
