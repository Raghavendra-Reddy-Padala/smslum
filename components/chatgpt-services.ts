// src/services/chatgpt-service.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Define the Message interface
type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  attachments?: {
    type: "image" | "file"
    url: string
    name: string
  }[]
}

type SimplifiedMessage = {
  content: string
  sender: "user" | "bot"
};
// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey:process.env.OPENAI_API_KEY, 
  dangerouslyAllowBrowser: true // Only use this for client-side if absolutely necessary
});

// Alternative server-side approach (recommended)
// const API_URL = '/api/chat'; // Create a Next.js API route to proxy requests

export async function getChatGPTResponse(messages: SimplifiedMessage[], systemPrompt: string): Promise<string> {
  try {
    // Convert your chat messages to the format expected by the OpenAI API
    const formattedMessages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'Sorry, I couldn\'t generate a response.';
    
    // Alternative approach using your own API route
    /*
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: formattedMessages })
    });
    
    if (!response.ok) throw new Error('Failed to get response');
    const data = await response.json();
    return data.message;
    */
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    return 'Sorry, there was an error processing your request.';
  }
}