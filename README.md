# 📝 Todo Summary Assistant

A modern full-stack productivity app that allows users to manage their personal to-dos, generate intelligent summaries using AI (OpenAI), and send them directly to Slack.

---

## 🚀 Features

- ✅ Add, edit, and delete todos
- 🧠 Summarize all pending todos using OpenAI
- 📤 Send the generated summary to a Slack channel
- 💾 Store todos in a Supabase PostgreSQL database
- 🎯 Clean, responsive design with animations and micro-interactions
- ✨ Built with Tailwind CSS, inspired by productivity apps like Notion and Linear

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|---------------------------------|
| Frontend    | React, Tailwind CSS             |
| Backend     | Node.js (Supabase Edge Functions) |
| Database    | Supabase PostgreSQL             |
| AI Summary  | OpenAI API                      |
| Slack Bot   | Slack Incoming Webhooks         |
| Hosting     | Vercel / Netlify (Frontend), Supabase (Backend) |

---

## 📦 Folder Structure

```bash
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── App.jsx
│   └── tailwind.config.js
├── functions/             # Supabase Edge Functions (Node.js)
│   ├── summarize/
│   └── todos/
├── supabase/              # DB schema and SQL
└── .env.example
