
import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

class InterviewService {
  private anthropic: Anthropic | null = null;
  private history: Message[] = [];
  private systemPrompt = "You are a professional, encouraging, but rigorous job interviewer. Your goal is to conduct a behavioral interview for a junior software developer position. Start by introducing yourself and asking the candidate if they are ready to begin. Keep your responses concise (under 3 sentences) to keep the conversation flowing. Do not provide feedback yet, just conduct the interview.";

  constructor() {
    if (API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true // Required for client-side usage in this demo
      });
    } else {
      console.warn("VITE_ANTHROPIC_API_KEY is not set.");
    }
  }

  async startSession(): Promise<string> {
    if (!this.anthropic) {
      return "Error: API Key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env.local file.";
    }

    this.history = [];
    
    // Pre-seed the greeting to ensure a consistent start without using tokens
    const greeting = "Hello! I'm your AI interviewer today. I'll be conducting a behavioral interview for a junior software developer role. Are you ready to begin?";
    this.history.push({ role: 'assistant', content: greeting });
    
    return greeting;
  }

  async processUserResponse(userText: string): Promise<string> {
    if (!this.anthropic) {
      return "Service not initialized. Please check your API key.";
    }

    try {
      // Add user message to history
      this.history.push({ role: 'user', content: userText });

      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: this.systemPrompt,
        messages: this.history
      });

      // Extract text content from the response
      const contentBlock = response.content[0];
      let reply = "";
      if (contentBlock.type === 'text') {
        reply = contentBlock.text;
      } else {
        reply = "I'm sorry, I couldn't generate a text response.";
      }

      // Add assistant response to history
      this.history.push({ role: 'assistant', content: reply });
      
      return reply;
    } catch (error: any) {
      console.error("Anthropic API Error:", error);
      
      // Remove the user message that failed so we don't get into a bad state
      this.history.pop();
      
      if (error.message?.includes("401")) {
        return "Error: Invalid Anthropic API Key. Please check your .env.local file.";
      }
      if (error.message?.includes("credit")) {
        return "Error: You may be out of Anthropic API credits.";
      }
      
      return `I encountered an error: ${error.message || "Unknown error"}. Please try again.`;
    }
  }
}

export const interviewService = new InterviewService();
