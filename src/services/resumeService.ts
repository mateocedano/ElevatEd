import Anthropic from '@anthropic-ai/sdk';
import * as pdfjsLib from 'pdfjs-dist';

// Use the worker from the public directory
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

import defaultSystemPrompt from '../prompts/resume-review-prompt.txt?raw';

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

class ResumeService {
  private anthropic: Anthropic | null = null;

  constructor() {
    if (API_KEY) {
      this.anthropic = new Anthropic({
        apiKey: API_KEY,
        dangerouslyAllowBrowser: true 
      });
    } else {
      console.warn("VITE_ANTHROPIC_API_KEY is not set.");
    }
  }

  async extractTextFromPdf(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText;
    } catch (e: any) {
      console.error("Error parsing PDF:", e);
      throw new Error(`Failed to extract text from PDF: ${e.message || e}`);
    }
  }

  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the Data URL prefix (e.g., "data:image/png;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert content to base64"));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  async reviewResume(file: File, customPrompt?: string): Promise<string> {
    if (!this.anthropic) {
      return "Error: API Key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env.local file.";
    }

    const systemPrompt = customPrompt || defaultSystemPrompt;

    try {
      let messages: any[] = [];

      if (file.type === 'application/pdf') {
        const text = await this.extractTextFromPdf(file);
        messages = [
            { 
              role: 'user', 
              content: `Here is the text content of a resume:\n\n${text}\n\nPlease review it.` 
            }
        ];
      } else if (file.type.startsWith('image/')) {
        const base64Data = await this.fileToBase64(file);
        const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
        
        messages = [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: "Please review this resume image."
              }
            ],
          }
        ];
      } else {
        return "Error: Unsupported file type. Please upload a PDF or Image.";
      }

      const response = await this.anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4000,
        system: systemPrompt,
        messages: messages
      });

      const contentBlock = response.content[0];
      if (contentBlock.type === 'text') {
        return contentBlock.text;
      }
      return "Error: No text response generated.";

    } catch (e: unknown) {
      console.error("Error generating review:", e);
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      return `Error generating review: ${errorMessage}`;
    }
  }
}

export const resumeService = new ResumeService();
