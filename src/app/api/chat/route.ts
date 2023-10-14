
import { Conversation } from "@/lib/conversation";
import { Metadata, getMatchesFromEmbeddings } from "@/lib/matches";
import { summarizeLongDocument } from "@/lib/summarizer";
import { templates } from "@/lib/templates";
import { PineconeClient } from "@pinecone-database/pinecone";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI, ChatOpenAICallOptions } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { BaseMessageChunk, ChainValues } from "langchain/schema";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { SqlDatabase } from "langchain/sql_db";
import { NextRequest, NextResponse } from "next/server";
import { DataSource } from "typeorm";

export const maxDuration = 300;
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const datasource = new DataSource({
      type: "postgres",
      host: process.env.POSTGRES_DB_HOST,
      port: Number(process.env.POSTGRES_DB_PORT),
      username: process.env.POSTGRES_DB_USER,
      password: process.env.POSTGRES_DB_PASSWORD,
      database: process.env.POSTGRES_DB_DATABASE,
    });
console.log('datasource', datasource);

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: datasource,
    });

    const schema = await db.getTableInfo();
    console.log('schema', schema);
    

    if (!schema) {
      throw new Error("No schema found");
      return;
    }
    

    const prompt =
      PromptTemplate.fromTemplate(`Based on the table schema below, write a postgres SQL query that would answer the user's question and do not mention that you do a sql query in the answer:
{schema}

Question: {question}
SQL Query:`);

    const model: ChatOpenAI<ChatOpenAICallOptions> = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const sqlQueryGeneratorChain = RunnableSequence.from([
      {
        schema: async () => db.getTableInfo(),
        question: (input) => input.question,
      },
      prompt,
      model.bind({ stop: ["\nSQLResult:"] }),
      new StringOutputParser(),
    ]);

    const result = await sqlQueryGeneratorChain.invoke({
      question: body.message,
    });

    console.log('query', result);

    if (!result.startsWith('SELECT')) {
        return await handleRequest({prompt: body.message});
    }
   /*  if (!result.startsWith('SELECT')) {
        const chatResponse = await chat(body.message, model);
        return NextResponse.json({
            ...chatResponse
        });
    } */

    const finalResponsePrompt =
      PromptTemplate.fromTemplate(`Based on the table schema below, question, postgres sql query, and sql response, write a natural language response, is the response is a list or table, please write a response in markdown format when show the list or table in a separate line, if there are no data, please write a short message to express that there are no data:
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}`);

    const fullChain = RunnableSequence.from([
      {
        question: (input) => input.question,
        query: sqlQueryGeneratorChain,
      },
      {
        schema: async () => db.getTableInfo(),
        question: (input) => input.question,
        query: (input) => input.query,
        response: (input) => db.run(input.query),
      },
      finalResponsePrompt,
      model,
    ]);

    const finalResponse: BaseMessageChunk = await fullChain.invoke({
      question: body.message,
    });
    console.log('final response', finalResponse.content);

    return NextResponse.json({
        message: body.message,
        ai: finalResponse.content
    });
  } catch (error) {
    console.log("[USERS_POST123]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function chat(input: string, model: ChatOpenAI<ChatOpenAICallOptions>) {
    const template = "Respond the question with short answer and be nice\n Question: {question}";

    const prompt = new PromptTemplate({ template, inputVariables: ["question"] });

    const chain = new LLMChain({ llm: model, prompt });

    const result: ChainValues = await chain.call({ question: input });
    console.log('result', result);
    
    return  {
        message: input,
        ai: result.text.replaceAll('Answer: ', '')
    }
}

const llm = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0,
});
let pinecone: PineconeClient | null = null;

const initPineconeClient = async () => {
  pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

const handleRequest = async ({
  prompt
}: {
  prompt: string;
}) => {
  try {
    if (!pinecone) {
      await initPineconeClient();
    }

    let summarizedCount = 0;
    // Retrieve the conversation log and save the user's prompt
    const conversation = new Conversation();
    const conversationHistory = await conversation.getConversation({
      limit: 10,
    });
    await conversation.addEntry({ entry: prompt, speaker: "user" });

    // Build an LLM chain that will improve the user prompt
    const inquiryChain = new LLMChain({
      llm,
      prompt: new PromptTemplate({
        template: templates.inquiryTemplate,
        inputVariables: ["userPrompt", "conversationHistory"],
      }),
    });
    const inquiryChainResult = await inquiryChain.call({
      userPrompt: prompt,
      conversationHistory,
    });
    const inquiry = inquiryChainResult.text;

    console.log(inquiry);

    console.log(inquiry);

    // Embed the user's intent and query the Pinecone index
    const embedder = new OpenAIEmbeddings({
      modelName: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const embeddings = await embedder.embedQuery(inquiry);
    const matches = await getMatchesFromEmbeddings(embeddings, pinecone!, 2);

    const urls =
      matches &&
      Array.from(
        new Set(
          matches.map((match) => {
            const metadata = match.metadata as Metadata;
            const { url } = metadata;
            return url;
          })
        )
      );

    console.log(urls);

    const docs =
      matches &&
      Array.from(
        matches.reduce((map, match) => {
          const metadata = match.metadata as Metadata;
          const { text, url } = metadata;
          if (!map.has(url)) {
            map.set(url, text);
          }
          return map;
        }, new Map())
      ).map(([_, text]) => text);

    const promptTemplate = new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: ["summaries", "question", "conversationHistory", "urls"],
    });

    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: chat,
    });

    const allDocs = docs.join("\n");
    const summary =
      allDocs.length > 4000
        ? await summarizeLongDocument({ document: allDocs, inquiry })
        : allDocs;

    const response = await chain.call({
      summaries: summary,
      question: prompt,
      conversationHistory,
      urls,
    });

    console.log("response", response);
    return NextResponse.json({
      message: prompt,
      ai: response.text,
  });
  } catch (error) {
    console.log("error", error);
  }
};
