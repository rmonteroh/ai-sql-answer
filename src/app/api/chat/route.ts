import { Conversation } from "@/lib/conversation";
import { Metadata, getMatchesFromEmbeddings } from "@/lib/matches";
import { summarizeLongDocument } from "@/lib/summarizer";
import { templates } from "@/lib/templates";
import { LLMChain } from "langchain/chains";
import {
  ChatOpenAI,
  ChatOpenAICallOptions,
} from "langchain/chat_models/openai";
import {
  PromptTemplate,
} from "langchain/prompts";
import {
  BaseMessageChunk,
} from "langchain/schema";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnableSequence } from "langchain/schema/runnable";
import { SqlDatabase } from "langchain/sql_db";
import { NextRequest, NextResponse } from "next/server";
import {
  chatOpenAI,
  dataSourceInit,
  embedder,
  initPineconeClient,
  llm,
  pusherInit,
} from "../../../lib/initializations";

export const maxDuration = 300;
export async function POST(request: NextRequest) {
  console.time("POST");
  const body: {message: string, history: { message: string; ai: string }[]} = await request.json();
  const model: ChatOpenAI<ChatOpenAICallOptions> = chatOpenAI;
  try {
    const dataSource = dataSourceInit;
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: dataSource,
      includesTables: ['logic', 'projects', 'tasks', 'resource_assignments']
    });
    const schema = await db.getTableInfo();
    // const prompt = PromptTemplate.fromTemplate(templates.sqlWriterTemplate);

    const prompt =
    PromptTemplate.fromTemplate(`Based on the table schema and history below write a postgres sql query following the rules bellow:
      - If project is not mentioned in the question or in the history, do not filter by project, do not add the project to the query.
      - If you received this question: 'Can you show me a 2 week lookahead?' return the following question: 'Sure, would you like me to list the tasks for the next 2 week?'
      - If you received this question: 'What is total float?' return the following answer: 'Response-def This should be a general definition for anything related to CPM scheduling.  All questions related to CPM scheduling should be addressed.'
      - If you received this question: 'When do I need a construction hoist on my project' return the following answer: 'Response-def It would have to know the location of the building and the code in that area to answer the question.  In NYC you need a hoist on the building when the working deck reaches 75’.'
      - Do not mention that you do a sql query in the answer
      - If you received this question: 'Can you create a breakout schedule for concrete and electrical activities? I only want to see construction activities.' return the following query: SELECT t.task_name, t.start_date, t.end_date
          FROM tasks t
          JOIN projects p ON t.project_id = p.project_id
          WHERE p.project_name LIKE '%Construction%'
          AND (t.task_name LIKE '%Concrete%' OR t.task_name LIKE '%Electrical%')'

      {schema}
      {history}
      
      Question: {question}
      SQL Query:`);


    console.log("history", JSON.stringify(body.history));
    // Analyze the question and generate a sql query
    pusherInit.trigger("process-status", 'status-update', {message: 'Analyzing question and context...'});

    const sqlQueryGeneratorChain = RunnableSequence.from([
      {
        schema: () => schema,
        history: () => JSON.stringify(body.history),
        question: (input) => input.question,
      },
      prompt,
      model.bind({ stop: ["\nSQLResult:"] }),
      new StringOutputParser(),
    ]);

    const result = await sqlQueryGeneratorChain.invoke({
      question: body.message,
    });
    // Processing the question
    pusherInit.trigger("process-status", 'status-update', {message: 'Processing question...'});

    console.log("query", result);
    // Missing data
    if (result.includes("?")) {
      return NextResponse.json({
        message: body.message,
        ai: result,
      });
    }
    // Predefined response
    if (result.includes("Response-def")) {
      return NextResponse.json({
        message: body.message,
        ai: result.replaceAll("Response-def", ""),
      });
    }

    // Check Sunrise website data
    if (!result.startsWith("SELECT")) {
      // Check Sunrises website information
      pusherInit.trigger("process-status", 'status-update', {message: 'Checking Sunrise website information...'});
      return await handleRequest({ prompt: body.message });
    }
    pusherInit.trigger("process-status", 'status-update', {message: 'Searching in database...'});
    const finalResponsePrompt = PromptTemplate.fromTemplate(
      templates.sqlExecutorTemplate
    );

    const fullChain = RunnableSequence.from([
      {
        question: (input) => input.question,
        query: sqlQueryGeneratorChain,
      },
      {
        schema: () => schema,
        question: (input) => input.question,
        query: (input) => input.query,
        response: (input) => {
          console.time("SQL");
          return db
            .run(input.query)
            .then((res) => {
              console.log("res", res);

              console.timeEnd("SQL");
              console.time("OpenAI");
              // Data constructed from database
              pusherInit.trigger("process-status", 'status-update', {message: 'Processing data before send answer...'});
              return res;
            })
            .catch((err) => {
              console.timeEnd("SQL");
              return err;
            });
        },
      },
      finalResponsePrompt,
      model,
    ]);

    const finalResponse: BaseMessageChunk = await fullChain.invoke({
      question: body.message,
    });
    console.log("final response", finalResponse.content);
    console.timeEnd("POST");
    return NextResponse.json({
      message: body.message,
      ai: finalResponse.content,
    });
  } catch (error) {
    console.log("[USERS_POST123]", error);
    return NextResponse.json({
      message: body.message,
      ai: "Sorry, I am not able to answer your question.",
    });
  }
}

const handleRequest = async ({ prompt }: { prompt: string }) => {
  try {
    const pinecone = await initPineconeClient();

    // let summarizedCount = 0;
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

    // Embed the user's intent and query the Pinecone index
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

    const chain = new LLMChain({
      prompt: promptTemplate,
      llm: chatOpenAI,
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
