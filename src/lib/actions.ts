// @/lib/actions.ts
'use server';

import { suggestTaskCategories } from '@/ai/flows/suggest-task-categories';
import { z } from 'zod';

const getCategorySuggestionsSchema = z.object({
  taskTitle: z.string(),
});

export async function getCategorySuggestions(
  values: z.infer<typeof getCategorySuggestionsSchema>
) {
  const validatedFields = getCategorySuggestionsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid input' };
  }

  try {
    const result = await suggestTaskCategories({ taskTitle: validatedFields.data.taskTitle });
    return { categories: result.categories };
  } catch (error) {
    console.error('Error fetching category suggestions:', error);
    return { error: 'Failed to get suggestions. Please try again.' };
  }
}
