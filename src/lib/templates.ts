const templates = {
    qaTemplate: `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
          - There will be a CONVERSATION LOG, CONTEXT, and a QUESTION.
          - The final answer must always be styled using markdown.
          - Your main goal is to point the user to the right source of information (the source is always a URL) based on the CONTEXT you are given.
          - Your secondary goal is to provide the user with an answer that is relevant to the question.
          - Provide the user with a code example that is relevant to the question, if the context contains relevant code examples. Do not make up any code examples on your own.
          - Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
          - Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
          - Do not make up any answers if the CONTEXT does not have relevant information.
          - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
          - The CONTEXT is a set of JSON objects, each includes the field "text" where the content is stored, and "url" where the url of the page is stored.
          - The URLs are the URLs of the pages that contain the CONTEXT. Always include them in the answer as "Sources" or "References", as numbered markdown links.
          - Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
          - ALWAYS prefer the result with the highest "score" value.
          - Ignore any content that is stored in html tables.
          - The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the response based on the question without clear reference to the context.
          - Summarize the CONTEXT to make it easier to read, but don't omit any information.
          - It is IMPERATIVE that any link provided is found in the CONTEXT. Prefer not to provide a link if it is not found in the CONTEXT.
  
          CONVERSATION LOG: {conversationHistory}
  
          CONTEXT: {summaries}
  
          QUESTION: {question}
  
          URLS: {urls}
  
          Final Answer: `,
    summarizerTemplate: `Shorten the text in the CONTENT, attempting to answer the INQUIRY You should follow the following rules when generating the summary:
      - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
      - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
      - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
      - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty, AND NO TEXT SHOULD BE RETURNED IN THE FINAL ANSWER AT ALL.
      - If the INQUIRY cannot be answered, the final answer should be empty.
      - The summary should be under 4000 characters.
      - The summary should be 2000 characters long, if possible.
  
      INQUIRY: {inquiry}
      CONTENT: {document}
  
      Final answer:
      `,
    summarizerDocumentTemplate: `Summarize the text in the CONTENT. You should follow the following rules when generating the summary:
      - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
      - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
      - Summary should include code examples when possible. Do not make up any code examples on your own.
      - The summary should be under 4000 characters.
      - The summary should be at least 1500 characters long, if possible.
  
      CONTENT: {document}
  
      Final answer:
      `,
    inquiryTemplate: `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
      You should follow the following rules when generating and answer:
      - Always prioritize the user prompt over the conversation log.
      - Ignore any conversation log that is not directly related to the user prompt.
      - Only attempt to answer if a question was posed.
      - The question should be a single sentence
      - You should remove any punctuation from the question
      - You should remove any words that are not relevant to the question
      - If you are unable to formulate a question, respond with the same USER PROMPT you got.
  
      USER PROMPT: {userPrompt}
  
      CONVERSATION LOG: {conversationHistory}
  
      Final answer:
      `,
    summerierTemplate: `Summarize the following text. You should follow the following rules when generating and answer:`,
    dbSchema: `CREATE TABLE "public"."conversations" (
      id bigint NOT NULL, created_at timestamp with time zone NOT NULL, entry character varying , speaker character varying ) 
      SELECT * FROM "public"."conversations" LIMIT 3;
       id created_at entry speaker
      CREATE TABLE "public"."logic" (
      logic_id integer NOT NULL, prerequisite_task_id integer , dependent_task_id integer ) 
      SELECT * FROM "public"."logic" LIMIT 3;
       logic_id prerequisite_task_id dependent_task_id
       1 1 2
       2 2 3
       3 3 4
      CREATE TABLE "public"."projects" (
      project_id integer NOT NULL, project_name character varying ) 
      SELECT * FROM "public"."projects" LIMIT 3;
       project_id project_name
       1 High-rise Building Construction Project
       2 Residential Complex Construction Project
       3 Bridge Construction Project
      CREATE TABLE "public"."resource_assignments" (
      assignment_id integer NOT NULL, task_id integer , resource_name character varying , assignment_duration integer ) 
      SELECT * FROM "public"."resource_assignments" LIMIT 3;
       assignment_id task_id resource_name assignment_duration
       1 1 Excavator Operator 2
       2 2 Construction Worker 2
       3 3 Bricklayer 2
      CREATE TABLE "public"."tasks" (
      task_id integer NOT NULL, task_name character varying , project_id integer , commencement_date date , conclusion_date date , duration integer ) 
      SELECT * FROM "public"."tasks" LIMIT 3;
       task_id task_name project_id commencement_date conclusion_date duration
       1 Excavation 1 Wed Oct 11 2023 00:00:00 GMT-0500 (Eastern Standard Time) Sat Oct 14 2023 00:00:00 GMT-0500 (Eastern Standard Time) 3
       2 Foundation Construction 1 Wed Oct 18 2023 00:00:00 GMT-0500 (Eastern Standard Time) Sat Oct 21 2023 00:00:00 GMT-0500 (Eastern Standard Time) 3
       3 Wall Construction 1 Wed Oct 25 2023 00:00:00 GMT-0500 (Eastern Standard Time) Sat Oct 28 2023 00:00:00 GMT-0500 (Eastern Standard Time) 3
      `,
      // Create an sql query base on the conversation bellow
      conversationTemplate: `Answer the question based on the context below. You should determinate if with the following database schema you can create a query that answers the question. If you can, write the query. If you can't, write "I can't".:
        - Database schema: {dbSchema}
      `,
  }
  
  export { templates }