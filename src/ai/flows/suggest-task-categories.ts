'use server';

/**
 * @fileOverview A flow for suggesting relevant categories for tasks based on their titles.
 *
 * - suggestTaskCategories - A function that suggests categories for a given task title.
 * - SuggestTaskCategoriesInput - The input type for the suggestTaskCategories function.
 * - SuggestTaskCategoriesOutput - The return type for the suggestTaskCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskCategoriesInputSchema = z.object({
  taskTitle: z.string().describe('The title of the task.'),
});
export type SuggestTaskCategoriesInput = z.infer<
  typeof SuggestTaskCategoriesInputSchema
>;

const SuggestTaskCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested categories for the task.'),
});
export type SuggestTaskCategoriesOutput = z.infer<
  typeof SuggestTaskCategoriesOutputSchema
>;

export async function suggestTaskCategories(
  input: SuggestTaskCategoriesInput
): Promise<SuggestTaskCategoriesOutput> {
  return suggestTaskCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskCategoriesPrompt',
  input: {schema: SuggestTaskCategoriesInputSchema},
  output: {schema: SuggestTaskCategoriesOutputSchema},
  prompt: `You are a task management assistant. Given a task title, you will suggest relevant categories for the task.

Task Title: {{{taskTitle}}}

Suggest a few categories for this task.`,
});

const suggestTaskCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTaskCategoriesFlow',
    inputSchema: SuggestTaskCategoriesInputSchema,
    outputSchema: SuggestTaskCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
