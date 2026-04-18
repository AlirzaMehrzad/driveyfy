import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async generateWithOllama(prompt: string) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3',
          prompt,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating with Ollama:', error);
      throw error;
    }
  }

  async generateWithDeepSeek(prompt: string) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-r1:latest',
          prompt,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error generating with DeepSeek:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'nomic-embed-text',
          prompt: text,
        }),
      });
      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }
}
