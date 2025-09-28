import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4'),
    messages,
    system: `You are R3 Digital's AI assistant. You are knowledgeable about:
    
    - Digital marketing strategies and performance marketing
    - Data analytics and measurement
    - SEO, PPC, social media marketing
    - R3 Digital's services and approach
    - Web development and digital solutions
    
    Always be helpful, professional, and focus on providing actionable insights. 
    If you don't know something specific about R3 Digital, acknowledge that and 
    suggest contacting the team directly.`,
  });

  return result.toDataStreamResponse();
}