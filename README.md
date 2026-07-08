# GrowEasy CRM - AI Powered Lead Importer

GrowEasy CRM includes an advanced, AI-powered CSV lead importer that takes messy spreadsheets from any source (Facebook Ads, Google Ads, manual exports) and intelligently maps them to structured CRM fields using Large Language Models (LLMs).

## Features & Bonus Points Completed

- **Intelligent Field Mapping**: Extracts fields even if column headers are weird or messy.
- **Handling Messy Datasets**: Sanitizes data, fixes formats, extracts phone numbers correctly.
- **Streaming/Incremental Parsing**: Uses `csv-parse` readable streams for chunked incremental processing. No Out-Of-Memory errors on huge files!
- **Retry Mechanism**: Implements exponential backoff for failed AI batches to ensure reliable completion.
- **Virtualized Tables**: Both the Preview and Results tables use `@tanstack/react-virtual` to smoothly render 100,000+ rows without freezing the browser.
- **Real-time Progress Indicators**: Visual progress bars and batch-level indicators track AI processing live.
- **Drag & Drop Upload**: Modern `react-dropzone` integration for seamless file dropping.
- **Dark Mode**: Next-themes integration with CSS variables for a stunning dark mode experience.
- **Docker Support**: Containerized via Docker and `docker-compose`.
- **Unit Tests**: Pre-configured with Jest and React Testing Library for frontend and backend logic.
- **Modern Tech Stack**: Next.js 14 App Router, Express.js backend, and multiple AI providers supported (Gemini, OpenAI, Anthropic).

## Architecture

This project is structured as a monorepo using npm workspaces:

- `frontend/`: Next.js 14 application providing the user interface.
- `backend/`: Express.js backend server handling file uploads, stream processing, and AI integrations.
- `shared/`: Shared Typescript types for seamless type safety across the stack.

## Setup Instructions

### 1. Prerequisites
- Node.js v20+
- npm v10+
- A Google Gemini API Key (or OpenAI/Anthropic)

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:
```bash
PORT=3001
GEMINI_API_KEY=your_gemini_key_here
AI_PROVIDER=gemini
AI_MODEL=gemini-1.5-flash
```

Create a `.env.local` file in the `frontend/` directory (optional):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Installation & Local Development

Install all dependencies from the root directory:
```bash
npm install
```

Start both the frontend and backend simultaneously:
```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

### 4. Running with Docker

You can spin up the entire stack using Docker Compose:

```bash
docker-compose up --build
```

### 5. Running Tests

To run the Jest test suites across the monorepo:
```bash
npm test
```

## Deployment

### Deploying the Frontend (Vercel)
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Set the Root Directory to `frontend`.
4. Set the Build Command to `npm run build`.
5. Add the Environment Variable: `NEXT_PUBLIC_API_URL` pointing to your deployed backend.
6. Deploy!

### Deploying the Backend (Render / Railway)
1. Connect your repository to Render/Railway.
2. Set the Root Directory to `backend` (or run from root with build command `npm run build -w shared && npm run build -w backend`).
3. Set the Start Command to `node dist/index.js` (or `npm start -w backend`).
4. Add all environment variables from your `.env` file.
5. Deploy!
