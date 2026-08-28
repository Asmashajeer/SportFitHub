export interface IEmbeddingService{
    embedText(text: string): Promise<number[]> 
}