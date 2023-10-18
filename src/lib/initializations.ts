import { PineconeClient } from "@pinecone-database/pinecone";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";

export const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});

export const initPineconeClient = async () => {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
    return pinecone;
};

export const embedder = new OpenAIEmbeddings({
  modelName: "text-embedding-ada-002",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export const chatOpenAI = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
