import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export async function POST() {
  try {
    const prompt = `
Create a list of exactly three open-ended and engaging questions for an anonymous social messaging platform similar to Qooh.me.

Requirements:
- Return the questions as a single string.
- Separate each question using "||".
- Do not number the questions.
- Do not include any extra text, explanations, or formatting.
- Avoid personal, sensitive, controversial, political, religious, or inappropriate topics.
- Focus on universal themes, hobbies, experiences, aspirations, creativity, and friendly conversation.
- Make the questions interesting enough to encourage users to respond.

Example output format:
What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that always makes you smile?

Generate three unique questions now.
`;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
    });

    console.log(result);
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Groq Error:', error);

    return Response.json(
      {
        success: false,
        message: 'Failed to generate questions',
      },
      { status: 500 }
    );
  }
}