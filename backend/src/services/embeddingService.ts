import { IEmbeddingService } from "@/interfaces/services/IEmbeddingService";
import { GoogleGenAI } from "@google/genai";





export class EmbeddingService implements IEmbeddingService{
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({ apiKey: apiKey });
  }

  async embedText(text: string): Promise<number[]> {
    // const model = this.genAI.getGenerativeModel({ model: 'models/text-embedding-004' });
   
   const result = await this.genAI.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    });
  const vector = result.embeddings?.[0]?.values;
  if (!vector) {
      throw new Error("Failed to generate embedding vector.");
    }
    return vector;
  }
}