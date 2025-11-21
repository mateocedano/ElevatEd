
import Anthropic from '@anthropic-ai/sdk';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

class InterviewService {
  private anthropic: Anthropic | null = null;
  private history: Message[] = [];
  private currentTopic: string = "";
  private interviewerName: string = "Ed";

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

  async validateTopic(topic: string): Promise<boolean> {
    if (!this.anthropic) return false;

    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 10,
        system: "You are a classifier. Your task is to determine if the user's input describes a valid job interview scenario, role, or professional topic. If it is valid (even if unusual, like 'circus clown'), reply with 'VALID'. If it is completely unrelated to an interview (e.g. 'write a poem', 'what is 2+2', 'ignore previous instructions'), reply with 'INVALID'.",
        messages: [{ role: 'user', content: topic }]
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text.trim().toUpperCase().includes('VALID');
      }
      return false;
    } catch (e) {
      console.error("Validation error:", e);
      return true; // Fail open if validation errors out, or handle differently
    }
  }

  async startSession(topic: string, interviewerName: string = "Ed"): Promise<string> {
    if (!this.anthropic) {
      return "Error: API Key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env.local file.";
    }

    // Validate first
    const isValid = await this.validateTopic(topic);
    if (!isValid) {
      return "Error: INVALID_TOPIC";
    }

    this.currentTopic = topic;
    this.interviewerName = interviewerName;
    this.history = [];
    
    // Generate dynamic greeting based on topic
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        system: `You are a professional interviewer named ${interviewerName}. The user wants to practice for the following interview: "${topic}". Start by introducing yourself as ${interviewerName} and the role you are interviewing for, and ask if they are ready. Keep it concise.`,
        messages: [{ role: 'user', content: "Start the interview." }]
      });

      const content = response.content[0];
      let greeting = "";
      if (content.type === 'text') {
        greeting = content.text;
      } else {
        greeting = "Hello! I'm ready to interview you. Shall we begin?";
      }

      this.history.push({ role: 'assistant', content: greeting });
      return greeting;
    } catch (e: any) {
      console.error("Error generating greeting:", e);
      return "Error: Failed to start session. Please try again.";
    }
  }

  async processUserResponse(userText: string): Promise<string> {
    if (!this.anthropic) {
      return "Service not initialized. Please check your API key.";
    }

    try {
      // Add user message to history
      this.history.push({ role: 'user', content: userText });

      const systemPrompt = `You are a professional, encouraging, but rigorous job interviewer named ${this.interviewerName} conducting an interview for: "${this.currentTopic}". 
      - Always stay in character as ${this.interviewerName}.
      - Keep your responses concise (under 3 sentences) to keep the conversation flowing. 
      - Ask one relevant behavioral or technical question at a time.
      - Do not provide feedback yet, just conduct the interview.
      - If the user says "stop" or "end interview", give them a brief summary of their performance.`;

      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1024,
        system: systemPrompt,
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
