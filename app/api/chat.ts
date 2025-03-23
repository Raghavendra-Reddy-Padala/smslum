// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({
  apiKey:dotenv.config().parsed?.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 100,
    });

    return res.status(200).json({ 
      message: response.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
}