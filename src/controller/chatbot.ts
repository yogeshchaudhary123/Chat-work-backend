import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const chatBot = async (req: Request, res: Response) : Promise<void> => {
  const { message } = req.body;

  if (!message) {
     res.status(400).json({ error: 'Message is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or gpt-4 if you have access
      messages: [{ role: 'user', content: message }]
    });

    const reply = completion.choices[0].message?.content;
    res.json({ reply });
  } catch (error: any) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
};

export default { chatBot };
