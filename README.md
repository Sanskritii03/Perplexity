# Perplexity
A full-stack AI chatbot built with the MERN stack, powered by dual LLMs — Google Gemini 1.5 Flash Lite &amp; Mistral Small — with real-time web search via Tavily API and secure email-based authentication.


This project is a production-ready AI chatbot application built on the MERN stack (MongoDB, Express.js, React, Node.js). It integrates two large language models — **Gemini 1.5 Flash Lite** for fast, lightweight responses and **Mistral Small** for more nuanced generation — giving the app flexibility across different query types.

Real-time internet search is powered by the **Tavily API**, allowing the bot to answer up-to-date questions beyond its training data. User authentication is handled via **email verification** using a mail service (e.g. Nodemailer + SMTP), ensuring only verified users can access the chat interface.

## Tech stack

- **Frontend** — React.js
- **Backend** — Node.js + Express.js
- **Database** — MongoDB (Mongoose)
- **AI models** — Gemini 1.5 Flash Lite, Mistral Small Latest
- **Web search** — Tavily API
- **Auth** — JWT + Email verification
