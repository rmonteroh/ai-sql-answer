export const maxDuration = 30;
export const dynamic = 'force-dynamic';
import { LLMChain } from "langchain/chains";
import { ChatOpenAI, ChatOpenAICallOptions } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { BaseMessageChunk, ChainValues } from "langchain/schema";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { SqlDatabase } from "langchain/sql_db";
import { NextRequest, NextResponse } from "next/server";
import { DataSource } from "typeorm";

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
      PromptTemplate.fromTemplate(`Based on the table schema below, write a postgres SQL query that would answer the user's question:
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
        const chatResponse = await chat(body.message, model);
        return NextResponse.json({
            ...chatResponse
        });
    }

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
