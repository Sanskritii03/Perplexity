// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatMistralAI } from "@langchain/mistralai";
// import {
//   HumanMessage,
//   SystemMessage,
//   AIMessage,
// } from "@langchain/core/messages";
// import { tool } from "@langchain/core/tools";
// import { createReactAgent } from "@langchain/langgraph/prebuilt"; 
// import * as z from "zod";
// import { searchInternet } from "./internet.service.js";

// const message = new HumanMessage("Hello");

// const geminiModel = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const mistralAImodel = new ChatMistralAI({
//   model: "mistral-small-latest",
//   apiKey: process.env.MISTRAL_API_KEY,
// });

//  const searchInternetTool = tool(searchInternet, {
//    name: "searchInternet",
//    description: "use this tool to get the latest informatin from the internet.",
//    schema: z.object({
//      query: z.string().describe("the search query to look up on the internet."),
//    }),
//  });

//  const agent = createReactAgent({
//    model: geminiModel,
//    tools: [searchInternetTool],
//  });


// /*
// generating response
// */
// export async function generateResponse(messages) {
//   const response = await geminiModel.invoke(
//    messages.map((msg) => {
//       if (msg.role == "user") {
//         return new HumanMessage(msg.content);
//       } else if (msg.role == "ai") {
//         return new AIMessage(msg.content);
//       }
//     }),
//   );
//   return (await response).messages[(await response).messages.length - 1].text;
// }

// /*
// generating chat tittle
// */
// export async function generateChatTitle(message) {
//   const response = await mistralAImodel.invoke([
//     new SystemMessage(
//       ` 
//         yes you are a helpfull assitant that generate concise and desprictive tittle for chat conversation,
            
//             User will provide you with the first message of a chat conversation,
//             and you wiill generate a title that capture the esseence of the coversation in 3-5 words .. 
//             the title should e clear , relevent and enaging , givng users a quick understaning of 
//             the chats topic`,
//     ),

//     new HumanMessage(`
//         generate a title for a chat conversation based on the folwing message:
//         "${message}"
//         `),
//   ]);

//   return response.text;
// }
///////////////////////////////////////////


// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatMistralAI } from "@langchain/mistralai"
// import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
// import * as z from "zod";
// import { searchInternet } from "./internet.service.js";

// const geminiModel = new ChatGoogleGenerativeAI({
//     model: "gemini-flash-latest",
//     apiKey: process.env.GEMINI_API_KEY
// });

// const mistralModel = new ChatMistralAI({
//     model: "mistral-medium-latest",
//     apiKey: process.env.MISTRAL_API_KEY
// })

// const searchInternetTool = tool(
//     searchInternet,
//     {
//         name: "searchInternet",
//         description: "Use this tool to get the latest information from the internet.",
//         schema: z.object({
//             query: z.string().describe("The search query to look up on the internet.")
//         })
//     }
// )

// const agent = createAgent({
//     model: mistralModel,
//     tools: [ searchInternetTool ],
// })

// export async function generateResponse(messages) {
//     console.log(messages)

//     const response = await agent.invoke({
//         messages: [
//             new SystemMessage(`
//                 You are a helpful and precise assistant for answering questions.
//                 If you don't know the answer, say you don't know. 
//                 If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
//             `),
//             ...(messages.map(msg => {
//                 if (msg.role == "user") {
//                     return new HumanMessage(msg.content)
//                 } else if (msg.role == "ai") {
//                     return new AIMessage(msg.content)
//                 }
//             })) ]
//     });

//     return response.messages[ response.messages.length - 1 ].text;

// }

// export async function generateChatTitle(message) {

//     const response = await mistralModel.invoke([
//         new SystemMessage(`
//             You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
//             User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
//         `),
//         new HumanMessage(`
//             Generate a title for a chat conversation based on the following first message:
//             "${message}"
//             `)
//     ])

//     return response.text;

// }

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralAImodel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const agent = createReactAgent({
  llm: geminiModel,
  tools: [searchInternetTool],
  stateModifier: new SystemMessage(`
    You are a helpful assistant like perplexity with access to the internet.
    Today's date is: ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}.
    Use this to answer any questions about the current date, year, or time-sensitive topics.
    When you need latest information, use the searchInternet tool.
  `),
});

// Generating response
export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: messages.map((msg) => {
      if (msg.role == "user") return new HumanMessage(msg.content);
      else if (msg.role == "ai") return new AIMessage(msg.content);
    }),
  });

  const lastMessage = response.messages[response.messages.length - 1];
  return lastMessage.content;
}

// Generating chat title
export async function generateChatTitle(message) {
  const response = await mistralAImodel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles 
      for chat conversations. The user will provide the first message of a chat, 
      and you will generate a title that captures the essence in 3-5 words.
      Keep it clear, relevant, and engaging.
    `),
    new HumanMessage(`
      Generate a title for a chat conversation based on the following message:
      "${message}"
    `),
  ]);

  return response.content;
}