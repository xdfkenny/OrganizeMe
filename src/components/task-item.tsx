'use client';

import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Edit, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useAppContext } from '@/contexts/app-context';
import { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddEditTaskDialog } from '@/components/add-edit-task-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


const motivationalMessages = [
  "Great job!",
  "Task complete!",
  "One step closer!",
  "You're on a roll!",
  "Nicely done!",
  "Keep it up!",
];

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { deleteTask, toggleTaskCompleted, toggleSubtaskCompleted } = useAppContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubtasksOpen, setIsSubtasksOpen] = useState(false);
  const { toast } = useToast();

  const handleToggleCompleted = () => {
    toggleTaskCompleted(task.id);
    if (!task.completed) {
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      toast({
        title: randomMessage,
        description: `You've completed: "${task.title}"`,
      });
    }
  };

  return (
    <>
      <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={handleToggleCompleted}
          className="mt-1"
        />
        <div className="flex-1 grid gap-1">
          <label
            htmlFor={`task-${task.id}`}
            className={cn(
              'font-semibold cursor-pointer',
              task.completed && 'line-through text-muted-foreground'
            )}
          >
            {task.title}
          </label>
          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}
          {task.dueDate && (
            <p className="text-xs text-muted-foreground">
              Due: {format(new Date(task.dueDate), 'PPP')}
            </p>
          )}

          {task.subtasks.length > 0 && (
             <Collapsible open={isSubtasksOpen} onOpenChange={setIsSubtasksOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-auto -ml-2 h-auto px-2 py-1 text-xs">
                  {isSubtasksOpen ? <ChevronUp className="h-4 w-4 mr-1"/> : <ChevronDown className="h-4 w-4 mr-1" />}
                   {task.subtasks.length} subtask{task.subtasks.length > 1 ? 's' : ''}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                 {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 pl-4">
                    <Checkbox
                      id={`subtask-${subtask.id}`}
                      checked={subtask.completed}
                      onCheckedChange={() => toggleSubtaskCompleted(task.id, subtask.id)}
                    />
                    <label
                      htmlFor={`subtask-${subtask.id}`}
                      className={cn(
                        'text-sm',
                        subtask.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {subtask.title}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => deleteTask(task.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddEditTaskDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        taskToEdit={task}
      />
    </>
  );
}
