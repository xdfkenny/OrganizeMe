'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppContext } from '@/contexts/app-context';
import { Task, Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getCategorySuggestions } from '@/lib/actions';

const categoryColors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  categoryId: z.string().optional(),
  newCategoryName: z.string().optional(),
  newCategoryColor: z.string().optional(),
  subtasks: z.array(z.object({ title: z.string().min(1, 'Subtask cannot be empty') })),
});

type FormData = z.infer<typeof formSchema>;

interface AddEditTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task;
}

export function AddEditTaskDialog({ isOpen, onOpenChange, taskToEdit }: AddEditTaskDialogProps) {
  const { categories, addTask, updateTask, addCategory } = useAppContext();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      categoryId: undefined,
      newCategoryName: '',
      newCategoryColor: categoryColors[0],
      subtasks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  useEffect(() => {
    if (taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description,
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined,
        categoryId: taskToEdit.category?.id,
        subtasks: taskToEdit.subtasks.map(st => ({ title: st.title })),
      });
    } else {
      form.reset();
    }
    setAiSuggestions([]);
    setShowNewCategory(false);
  }, [taskToEdit, isOpen, form]);

  const fetchSuggestions = useCallback(
    debounce(async (title: string) => {
      if (title.length < 3) {
        setAiSuggestions([]);
        return;
      }
      setIsSuggesting(true);
      const result = await getCategorySuggestions({ taskTitle: title });
      if (result.categories) {
        setAiSuggestions(result.categories);
      }
      setIsSuggesting(false);
    }, 500),
    []
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title) {
        fetchSuggestions(value.title);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, fetchSuggestions]);
  
  const handleSelectSuggestion = (suggestion: string) => {
    const existingCategory = categories.find(c => c.name.toLowerCase() === suggestion.toLowerCase());
    if (existingCategory) {
      form.setValue('categoryId', existingCategory.id);
    } else {
      form.setValue('categoryId', 'new');
      setShowNewCategory(true);
      form.setValue('newCategoryName', suggestion);
    }
     setAiSuggestions([]);
  }

  const onSubmit = (data: FormData) => {
    let finalCategory: Category | undefined = undefined;

    if (data.categoryId === 'new') {
      const newCatName = data.newCategoryName?.trim();
      if (newCatName) {
        const existing = categories.find(c => c.name.toLowerCase() === newCatName.toLowerCase());
        if(existing) {
          finalCategory = existing;
        } else {
          finalCategory = {
            id: `cat-${Date.now()}`,
            name: newCatName,
            color: data.newCategoryColor || categoryColors[0],
          };
          addCategory(finalCategory);
        }
      }
    } else if (data.categoryId) {
      finalCategory = categories.find((c) => c.id === data.categoryId);
    }

    const taskData = {
      id: taskToEdit?.id || `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      completed: taskToEdit?.completed || false,
      dueDate: data.dueDate?.toISOString(),
      category: finalCategory,
      subtasks: data.subtasks.map((st, index) => ({
        id: taskToEdit?.subtasks[index]?.id || `sub-${Date.now()}-${index}`,
        title: st.title,
        completed: taskToEdit?.subtasks[index]?.completed || false,
      })),
    };

    if (taskToEdit) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    onOpenChange(false);
  };
  
  const handleCategoryChange = (value: string) => {
    form.setValue('categoryId', value);
    setShowNewCategory(value === 'new');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Finish project proposal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            { (aiSuggestions.length > 0 || isSuggesting) &&
              <div className="space-y-2">
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <span>AI Suggestions:</span>
                   {isSuggesting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {aiSuggestions.map(s => (
                     <Button type="button" key={s} variant="outline" size="sm" onClick={() => handleSelectSuggestion(s)}>{s}</Button>
                   ))}
                 </div>
              </div>
            }

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add more details..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={handleCategoryChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className='flex items-center gap-2'>
                              <span className={`h-2 w-2 rounded-full ${cat.color}`}></span>
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new">
                          <div className='flex items-center gap-2'>
                            <Plus className="h-4 w-4" />
                            Create new
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showNewCategory && (
              <div className="grid grid-cols-3 gap-4 rounded-md border p-4">
                <div className='col-span-2'>
                  <FormField
                    control={form.control}
                    name="newCategoryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Health" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="newCategoryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <div className="flex items-center gap-2">
                                <div className={cn('h-4 w-4 rounded-full', field.value)} />
                                <div className="truncate">Select color</div>
                              </div>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto">
                            <div className="grid grid-cols-6 gap-2">
                              {categoryColors.map(color => (
                                <button
                                  type="button"
                                  key={color}
                                  className={cn('h-6 w-6 rounded-full cursor-pointer', color)}
                                  onClick={() => field.onChange(color)}
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <FormLabel>Subtasks</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                   <FormField
                      control={form.control}
                      name={`subtasks.${index}.title`}
                      render={({ field }) => (
                         <FormItem className="flex-grow">
                           <FormControl>
                              <Input {...field} placeholder="Subtask description"/>
                           </FormControl>
                           <FormMessage />
                         </FormItem>
                      )}
                    />
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '' })}>
                <Plus className="mr-2 h-4 w-4" /> Add Subtask
              </Button>
            </div>


            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{taskToEdit ? 'Save Changes' : 'Create Task'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
